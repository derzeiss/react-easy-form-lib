import { FormBucket } from './FormBucket';

export interface FormBucketContextValue<T extends object> {
  formBucket: FormBucket<T>;
  setFormBucket: (newBucket: FormBucket<T>) => void;
}
