# Database

This document provides an overview of the database-related files, including seeding and migrations.

## `seed.ts`

This script is used to seed the database with initial data. It connects to the database, clears any existing users, and creates a default admin user.

### Key Features

- **Database Connection**: Uses `DatabaseUtils` to connect to and disconnect from the database.
- **Data Seeding**: Populates the `User` collection with a default admin user with predefined credentials and roles.
- **Error Handling**: Includes error handling to log any issues that occur during the seeding process and exits if an error is encountered.

To run the seed script, you can use the following command:

```bash
npm run seed
```

## `migrations/`

This directory contains database migration scripts. Migrations are used to manage incremental and reversible changes to the database schema.

### `template.ts`

This file serves as a template for creating new migration scripts. It includes two functions:

- **`up(connection: Connection)`**: This function is executed when applying the migration. It should contain the logic for making changes to the database schema.
- **`down(connection: Connection)`**: This function is executed when reverting the migration. It should contain the logic for undoing the changes made in the `up` function.

This structure ensures that database changes are version-controlled and can be applied or rolled back systematically.
