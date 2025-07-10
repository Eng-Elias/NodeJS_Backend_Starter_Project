# Module Generator

This script (`generateModule.ts`) is a command-line tool for rapidly scaffolding new CRUD modules in this Node.js project. It automatically generates all the necessary files for a new resource, including the model, controller, routes, and tests, and registers the new routes in the main router.

## How to Use

To use the generator, run the following command from the root of the project:

```bash
npm run generate:module -- --moduleName <YourModuleName> --fields="fieldName:Type:options,..."
```

### Arguments

- `moduleName`: The name of the module (e.g., `Product`, `User`). This will be used to name the generated files and classes.
- `fields`: A comma-separated string of fields for the module's schema. Each field has the following format:
  - `fieldName`: The name of the field (e.g., `name`, `email`).
  - `Type`: The data type of the field (e.g., `String`, `Number`, `Boolean`).
  - `options` (optional): Additional options for the field, such as `unique`.

### Example

To generate a `Product` module with a unique `name` (String), a `description` (String), and a `price` (Number), you would run the following command:

```bash
npm run generate:module -- --moduleName Product --fields="name:String:unique,description:String,price:Number"
```

### Generated Files

Running the command above will generate the following files:

- `src/models/product.model.ts`: The Mongoose model for the `Product` resource.
- `src/controllers/product.controller.ts`: The controller with CRUD operations for the `Product` resource.
- `src/routes/v1/product.routes.ts`: The Express routes for the `Product` resource.
- `src/types/product.types.ts`: The TypeScript types for the `Product` resource.
- `src/tests/product.test.ts`: The Jest tests for the `Product` resource.

Additionally, the script will automatically update `src/routes/v1/index.ts` to import and use the new `product.routes.ts` file.
