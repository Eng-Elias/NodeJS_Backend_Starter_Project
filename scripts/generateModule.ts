import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs-extra';
import path from 'path';

// --- UTILITY FUNCTIONS ---

/**
 * Capitalizes the first letter of a string.
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Parses the fields string and generates content for different parts of the module.
 */
const parseFields = (fieldsStr: string) => {
  const fields = fieldsStr.split(',').map((field) => {
    const [name, type, ...options] = field.split(':');
    return { name, type, options: options || [] };
  });

  const schemaFields = fields
    .map((f) => {
      let schema = `    ${f.name}: { type: ${f.type}, required: true`;
      if (f.options.includes('unique')) {
        schema += ', unique: true';
      }
      if (f.type.toLowerCase() === 'string') {
        schema += ', trim: true';
      }
      schema += ' }';
      return schema;
    })
    .join(',\n');

  const interfaceFields = fields
    .map((f) => `  ${f.name}: ${f.type.toLowerCase()};`)
    .join('\n');

  const validationFields = fields
    .map((f) => {
      let joiType = f.type.toLowerCase();
      if (joiType === 'string') {
        return `    ${f.name}: Joi.string().required(),`;
      } else if (joiType === 'number') {
        return `    ${f.name}: Joi.number().required(),`;
      } else if (joiType === 'boolean') {
        return `    ${f.name}: Joi.boolean().required(),`;
      }
      return `    ${f.name}: Joi.any().required(),`;
    })
    .join('\n');

  const testPostBody = fields
    .map((f) => {
      if (f.type.toLowerCase() === 'string') {
        return `      ${f.name}: 'test_${f.name}'`;
      } else if (f.type.toLowerCase() === 'number') {
        return `      ${f.name}: 123`;
      }
      return `      ${f.name}: 'test'`;
    })
    .join(',\n');

  const testPostBody2 = fields
    .map((f) => {
      if (f.type.toLowerCase() === 'string') {
        return `      ${f.name}: 'test_${f.name}_2'`;
      } else if (f.type.toLowerCase() === 'number') {
        return `      ${f.name}: 456`;
      }
      return `      ${f.name}: 'test2'`;
    })
    .join(',\n');

  return {
    schemaFields,
    interfaceFields,
    validationFields,
    testPostBody,
    testPostBody2,
  };
};

/**
 * Reads a template, replaces placeholders, and returns the new content.
 */
const generateFromTemplate = (
  templateContent: string,
  moduleName: string,
  replacements: Record<string, string>,
) => {
  return templateContent
    .replace(/__MODULE_NAME__/g, moduleName)
    .replace(/__MODULE_NAME_LOWERCASE__/g, moduleName.toLowerCase())
    .replace(/__SCHEMA_FIELDS__/g, replacements.schemaFields)
    .replace(/__INTERFACE_FIELDS__/g, replacements.interfaceFields)
    .replace(/__VALIDATION_FIELDS__/g, replacements.validationFields)
    .replace(/__TEST_POST_BODY__/g, replacements.testPostBody)
    .replace(/__TEST_POST_BODY_2__/g, replacements.testPostBody2);
};

// --- MAIN GENERATOR LOGIC ---

const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .option('moduleName', {
      type: 'string',
      demandOption: true,
      describe: 'Name of the module to generate (e.g., User)',
    })
    .option('fields', {
      type: 'string',
      demandOption: true,
      describe: 'Fields for the module, e.g., "name:String:unique,age:Number"',
    }).argv;

  const { moduleName, fields: fieldsStr } = argv;
  const capitalizedModuleName = capitalize(moduleName);
  const moduleNameLower = moduleName.toLowerCase();

  console.log(`Generating module: ${capitalizedModuleName}`);

  const fieldReplacements = parseFields(fieldsStr);

  const templateDir = path.join(__dirname, 'templates');
  const outputDirs = {
    model: path.join(__dirname, '../src/models'),
    controller: path.join(__dirname, '../src/controllers'),

    routes: path.join(__dirname, '../src/routes/v1'),
    types: path.join(__dirname, '../src/types'),
    test: path.join(__dirname, '../src/tests'),
  };

  const templateFiles = {
    model: 'model.template.ts',
    controller: 'controller.template.ts',

    routes: 'routes.template.ts',
    types: 'types.template.ts',
    test: 'test.template.ts',
  };

  for (const [type, templateFile] of Object.entries(templateFiles)) {
    const templatePath = path.join(templateDir, templateFile);
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    const generatedContent = generateFromTemplate(
      templateContent,
      capitalizedModuleName,
      fieldReplacements,
    );

    let fileName = `${moduleNameLower}.${type}.ts`;
    if (type === 'routes') fileName = `${moduleNameLower}.routes.ts`; // Special case for routes

    const outputPath = path.join((outputDirs as any)[type], fileName);
    await fs.writeFile(outputPath, generatedContent);
    console.log(`Created ${outputPath}`);
  }

  // --- AUTO-REGISTER ROUTES ---
  const mainRouterPath = path.join(outputDirs.routes, 'index.ts');
  const mainRouterContent = await fs.readFile(mainRouterPath, 'utf-8');

  const importStatement = `import ${moduleNameLower}Routes from './${moduleNameLower}.routes';`;
  const useStatement = `router.use('/${moduleNameLower}s', ${moduleNameLower}Routes);`;

  if (!mainRouterContent.includes(importStatement)) {
    const newContent = mainRouterContent
      .replace(
        '// Import routes here',
        `// Import routes here\n${importStatement}`,
      )
      .replace('// Use routes here', `// Use routes here\n${useStatement}`);

    await fs.writeFile(mainRouterPath, newContent);
    console.log(`Updated ${mainRouterPath} with new routes.`);
  }

  console.log('Module generation complete!');
};

main().catch((error) => {
  console.error('Failed to generate module:', error);
  process.exit(1);
});
