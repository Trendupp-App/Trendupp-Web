import { z } from 'zod';

// Mirrors the backend's password requirement (see ChangePasswordDto /
// ResetPasswordDto in the API docs): min 8 characters, at least one
// uppercase, one lowercase, one digit, and one special character.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export const PASSWORD_REQUIREMENT_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(PASSWORD_REGEX, PASSWORD_REQUIREMENT_MESSAGE);
