const typeDefs = `#graphql
  # The User object type
  type User {
    id: ID!
    username: String!
    email: String!
    profile: Profile
    roles: [String]!
    isEmailVerified: Boolean
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    firstName: String
    lastName: String
    avatar: String
  }

  # Input type for user registration
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  # Input type for user login
  input LoginInput {
    email: String!
    password: String!
  }

  # Input type for updating a user
  input UpdateUserInput {
    username: String
    firstName: String
    lastName: String
    avatar: String
  }
  
  # The response for authentication mutations
  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  # Queries
  type Query {
    me: User
    user(id: ID!): User
    users: [User]
  }

  # Mutations
  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
  }
`;

export default typeDefs;
