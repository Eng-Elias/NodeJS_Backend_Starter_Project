import Joi from 'joi';

/**
 * Utility class for data validation using Joi.
 */
export class ValidationUtils {
  /**
   * Joi schema for user creation.
   */
  public static createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
  });

  /**
   * Validates data against a Joi schema.
   * @param schema - The Joi schema to validate against.
   * @param data - The data to validate.
   * @returns The validated data or throws an error if validation fails.
   */
  public static validate(schema: Joi.ObjectSchema, data: any) {
    const { error, value } = schema.validate(data);
    if (error) {
      throw new Error(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
    }
    return value;
  }
}
