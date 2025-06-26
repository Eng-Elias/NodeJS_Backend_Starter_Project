import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { userModule } from './user';

const typeDefs = [userModule.typeDefs];
const resolvers = [userModule.resolvers];

export const mergedTypeDefs = mergeTypeDefs(typeDefs);
export const mergedResolvers = mergeResolvers(resolvers);
