import Joi from 'joi';

/**
 * Utility class for data validation using Joi.
 */
export class ValidationUtils {
  public static userCreateSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_\-]{3,}$/).trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
  });

  public static userLoginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required(),
  });

  public static refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  public static emailSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
  });

  public static resetPasswordSchema = Joi.object({
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.ref('password'),
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
