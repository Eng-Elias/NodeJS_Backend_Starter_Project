import 'dotenv/config';

export default {
  uri: process.env.MONGO_URI,
  collection: 'migrations',
  migrationsPath: './src/db/migrations',
  templatePath: './src/db/migrations/template.ts',
  autosync: false,
};
