import { ValidatorsFor } from './ValidatorsFor';

export interface FormBucket<T extends object> {
  values: T;
  touched: { [key in keyof T]?: boolean };
  errors: { [key in keyof T]?: string };
  validators: ValidatorsFor<T>;
  initialValues: T;
  hasChanged: boolean;
  isSubmitting: boolean;
}
