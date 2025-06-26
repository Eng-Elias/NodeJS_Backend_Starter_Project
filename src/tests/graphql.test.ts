import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';
import { User } from '@/models/user.model';
import { app } from '@/app';
import http from 'http';
import { setupGraphQLServer } from '@/graphql/server';

// Test user data
const testUser = {
  username: 'graphqluser',
  email: 'graphql@example.com',
  password: 'GraphQL123!',
  profile: {
    firstName: 'GraphQL',
    lastName: 'User',
  },
};

// GraphQL queries and mutations
const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        username
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      profile {
        firstName
        lastName
      }
      roles
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      profile {
        firstName
        lastName
      }
    }
  }
`;

describe('GraphQL API', () => {
  let server: http.Server;
  let port: number;
  let uri: string;
  let client: ApolloClient<any>;
  let authToken: string;

  beforeAll(async () => {
    // Start the server on a random port
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address();
        if (address && typeof address !== 'string') {
          port = address.port;
          uri = `http://localhost:${port}/graphql`;
        }
        resolve();
      });
    });
    
    // Set up the GraphQL server
    await setupGraphQLServer(app, server);

    // Create a basic Apollo Client
    const httpLink = createHttpLink({
      uri,
      fetch,
    });

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: authToken ? `Bearer ${authToken}` : '',
        },
      };
    });

    client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
        mutate: {
          fetchPolicy: 'no-cache',
        },
      },
    });
  });

  beforeEach(async () => {
    await User.deleteMany({});
    authToken = '';
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const registerInput = {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.profile.firstName,
        lastName: testUser.profile.lastName,
      };

      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { input: registerInput },
      });

      expect(data.register).toBeDefined();
      expect(data.register.accessToken).toBeDefined();
      expect(data.register.refreshToken).toBeDefined();
      expect(data.register.user.email).toBe(testUser.email);
      expect(data.register.user.username).toBe(testUser.username);
      expect(data.register.user.profile.firstName).toBe(testUser.profile.firstName);
      expect(data.register.user.profile.lastName).toBe(testUser.profile.lastName);

      // Save the token for subsequent tests
      authToken = data.register.accessToken;
    });

    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create(testUser);

      const registerInput = {
        username: 'anotheruser',
        email: testUser.email, // Same email as existing user
        password: 'Password123!',
        firstName: 'Another',
        lastName: 'User',
      };

      try {
        await client.mutate({
          mutation: REGISTER_MUTATION,
          variables: { input: registerInput },
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.graphQLErrors[0].message).toContain('An account with this email already exists');
        expect(error.graphQLErrors[0].extensions.code).toBe('BAD_USER_INPUT');
      }
    });

    it('should login an existing user', async () => {
      // Create a user first
      const user = await User.create({
        ...testUser,
        isEmailVerified: true,
      });

      const loginInput = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: loginInput },
      });

      expect(data.login).toBeDefined();
      expect(data.login.accessToken).toBeDefined();
      expect(data.login.refreshToken).toBeDefined();
      expect(data.login.user.email).toBe(testUser.email);
      expect(data.login.user.username).toBe(testUser.username);

      // Save the token for subsequent tests
      authToken = data.login.accessToken;
    });

    it('should not login with incorrect credentials', async () => {
      // Create a user first
      await User.create({
        ...testUser,
        isEmailVerified: true,
      });

      const loginInput = {
        email: testUser.email,
        password: 'WrongPassword!',
      };

      try {
        await client.mutate({
          mutation: LOGIN_MUTATION,
          variables: { input: loginInput },
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.graphQLErrors[0].message).toContain('Incorrect email or password');
        expect(error.graphQLErrors[0].extensions.code).toBe('UNAUTHENTICATED');
      }
    });
  });

  describe('Authenticated Queries', () => {
    beforeEach(async () => {
      // Create a user and get a token
      const user = await User.create({
        ...testUser,
        isEmailVerified: true,
      });

      const loginInput = {
        email: testUser.email,
        password: testUser.password,
      };

      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: loginInput },
      });

      authToken = data.login.accessToken;
    });

    it('should fetch the current user with me query', async () => {
      const { data } = await client.query({
        query: ME_QUERY,
      });

      expect(data.me).toBeDefined();
      expect(data.me.email).toBe(testUser.email);
      expect(data.me.username).toBe(testUser.username);
      expect(data.me.profile.firstName).toBe(testUser.profile.firstName);
      expect(data.me.profile.lastName).toBe(testUser.profile.lastName);
    });

    it('should not allow me query without authentication', async () => {
      // Clear the auth token
      authToken = '';

      try {
        await client.query({
          query: ME_QUERY,
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.graphQLErrors[0].message).toContain('You are not authenticated');
        expect(error.graphQLErrors[0].extensions.code).toBe('UNAUTHENTICATED');
      }
    });

    it('should update user profile', async () => {
      const updateInput = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const { data } = await client.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: { input: updateInput },
      });

      expect(data.updateUser).toBeDefined();
      expect(data.updateUser.profile.firstName).toBe(updateInput.firstName);
      expect(data.updateUser.profile.lastName).toBe(updateInput.lastName);

      // Verify the changes were saved to the database
      const updatedUser = await User.findOne({ email: testUser.email });
      expect(updatedUser?.profile.firstName).toBe(updateInput.firstName);
      expect(updatedUser?.profile.lastName).toBe(updateInput.lastName);
    });

    it('should not update user without authentication', async () => {
      // Clear the auth token
      authToken = '';

      const updateInput = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      try {
        await client.mutate({
          mutation: UPDATE_USER_MUTATION,
          variables: { input: updateInput },
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.graphQLErrors[0].message).toContain('You are not authenticated');
        expect(error.graphQLErrors[0].extensions.code).toBe('UNAUTHENTICATED');
      }
    });
  });
});
