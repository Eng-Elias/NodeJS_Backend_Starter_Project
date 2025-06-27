import { OpenAPIV3 } from 'openapi-types';

/**
 * Adds a global prefix to all paths in the Swagger/OpenAPI specification.
 * @param swaggerSpec The original Swagger specification object.
 * @param prefix The prefix to add to each path (e.g., '/api/v1').
 * @returns A new specification object with prefixed paths.
 */
export const addSwaggerPathPrefix = (
  swaggerSpec: OpenAPIV3.Document,
  prefix: string,
): OpenAPIV3.Document => {
  const newPaths: { [path: string]: OpenAPIV3.PathItemObject } = {};

  const cleanPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;

  for (const path in swaggerSpec.paths) {
    if (Object.prototype.hasOwnProperty.call(swaggerSpec.paths, path)) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      // If the original path is just '/', use the prefix itself, otherwise join them.
      const finalPath =
        path === '/' ? cleanPrefix : `${cleanPrefix}${cleanPath}`;
      newPaths[finalPath] = swaggerSpec.paths[path] as OpenAPIV3.PathItemObject;
    }
  }

  return {
    ...swaggerSpec,
    paths: newPaths,
  };
};
