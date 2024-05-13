import { FormBucket } from '../types/FormBucket';
import { validate } from './validation';

export const validateField = <T extends object>(
  name: keyof T,
  value: unknown,
  formBucket: FormBucket<T>
) => {
  const validators = formBucket.validators[name];
  if (!validators) return formBucket.errors;

  const validationErrors = validate(value, validators);
  return {
    ...formBucket.errors,
    [name]: validationErrors,
  };
};
