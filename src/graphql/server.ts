import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { type Express } from 'express';
import http from 'http';
import cors from 'cors';
import typeDefs from './schema';
import resolvers from './resolvers';
import { AuthUtils } from '@/utils/AuthUtils';
import { CustomJwtPayload } from '@/types/user.types';
import { User } from '@/models/user.model';

export async function setupGraphQLServer(
  app: Express,
  httpServer: http.Server,
) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer ')
        ) {
          token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
          try {
            const decoded = AuthUtils.verifyAccessToken(
              token,
            ) as CustomJwtPayload;
            const user = await User.findById(decoded.id);
            return { user };
          } catch (error) {
            // Invalid token, do not attach user to context
            return {};
          }
        }
        return {};
      },
    }),
  );
}
