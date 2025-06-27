# Template Utils

`TemplateUtils.ts` provides a simple yet effective way to render HTML templates by replacing placeholders with dynamic data. It's primarily used for generating the HTML content for emails, but it can be used for any simple templating task.

## Features

- **File-Based Templates**: Reads templates directly from the file system, making them easy to edit and manage.
- **Simple Placeholder Syntax**: Uses a straightforward `{{key}}` syntax for placeholders.
- **Dynamic Data Injection**: Replaces all occurrences of a placeholder with the corresponding data provided.
- **Error Handling**: Gracefully handles cases where a template file cannot be found or read, returning `null` instead of crashing.

## Static Methods

### `renderTemplate(templateName: string, data: { [key: string]: string }): string | null`

This is the core method of the utility. It reads an HTML file from the `src/templates` directory, finds all placeholders matching the keys in the `data` object, and replaces them with their corresponding values.

- **`templateName`**: The name of the template file, without the `.template.html` extension (e.g., `'emailVerification'`).
- **`data`**: An object where each key corresponds to a placeholder in the template.

**Usage:**

Assume you have a template file named `welcome.template.html` with the following content:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome!</title>
  </head>
  <body>
    <h1>Hi {{username}}!</h1>
    <p>Welcome to our platform. We're excited to have you.</p>
  </body>
</html>
```

You can render this template like so:

```typescript
import { TemplateUtils } from './utils/TemplateUtils';

const userData = {
  username: 'JohnDoe',
};

const htmlContent = TemplateUtils.renderTemplate('welcome', userData);

if (htmlContent) {
  // Now `htmlContent` contains the rendered HTML:
  // "<!DOCTYPE html>...<h1>Hi JohnDoe!</h1>..."
  // You can now use this content to send an email.
} else {
  console.error('Failed to render the welcome template.');
}
```
