import { User } from '@/models/user.model';
import { AuthUtils } from '@/utils/AuthUtils';
import config from '@/config';
import { GraphQLError } from 'graphql';
import { IUser, UserRole } from '@/types/user.types';

const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: { user?: IUser }) => {
      if (!context.user) {
        throw new GraphQLError('You are not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return await User.findById(context.user.id);
    },
    user: async (_: any, { id }: { id: string }, context: { user?: IUser }) => {
        if (!context.user) {
            throw new GraphQLError('You are not authenticated', {
              extensions: { code: 'UNAUTHENTICATED' },
            });
        }
        return await User.findById(id);
    },
    users: async (_: any, __: any, context: { user?: IUser }) => {
        if (!context.user) {
            throw new GraphQLError('You are not authenticated', {
              extensions: { code: 'UNAUTHENTICATED' },
            });
        }
        // TODO: Add role-based access control here for production
        if (!context.user.roles.includes(UserRole.ADMIN)) {
            throw new GraphQLError('You are not authorized', {
              extensions: { code: 'UNAUTHORIZED' },
            });
        }
        return await User.find({});
    },
  },
  Mutation: {
    register: async (_: any, { input }: any) => {
        const { username, email, password, firstName, lastName } = input;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new GraphQLError('An account with this email already exists.', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const newUser = await User.create({
            username,
            email,
            password,
            profile: { firstName, lastName },
        });

        const accessToken = AuthUtils.generateAccessToken({ id: newUser._id });
        const refreshToken = AuthUtils.generateRefreshToken({ id: newUser._id });
        newUser.refreshTokens = [refreshToken];
        await newUser.save();

        const userResponse = newUser.toObject();

        return {
            accessToken,
            refreshToken,
            user: userResponse,
        };
    },
    login: async (_: any, { input }: any) => {
        const { email, password } = input;

        if (!email || !password) {
            throw new GraphQLError('Please provide email and password!', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password || !(await AuthUtils.comparePassword(password, user.password))) {
            throw new GraphQLError('Incorrect email or password', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        if (config.email.verificationEnabled && !user.isEmailVerified) {
            throw new GraphQLError('Please verify your email address before logging in.', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const accessToken = AuthUtils.generateAccessToken({ id: user._id });
        const refreshToken = AuthUtils.generateRefreshToken({ id: user._id });

        await User.findByIdAndUpdate(
            user._id,
            { $push: { refreshTokens: refreshToken } },
        );

        const userResponse = user.toObject();
        
        return {
            accessToken,
            refreshToken,
            user: userResponse,
        };
    },
    updateUser: async (_: any, { input }: any, context: { user?: IUser }) => {
        if (!context.user) {
            throw new GraphQLError('You are not authenticated', {
              extensions: { code: 'UNAUTHENTICATED' },
            });
        }
        
        const { firstName, lastName, username, avatar } = input;
        const updateData: any = {};
        if (username) updateData.username = username;
        if (firstName) updateData['profile.firstName'] = firstName;
        if (lastName) updateData['profile.lastName'] = lastName;
        if (avatar) updateData['profile.avatar'] = avatar;

        const updatedUser = await User.findByIdAndUpdate(context.user.id, { $set: updateData }, { new: true });
        return updatedUser;
    },
  },
  User: {
    id: (user: IUser) => user._id.toString(),
  },
};

export default userResolvers;
