import {
  ChangeEvent,
  ChangeEventHandler,
  Context,
  FocusEvent,
  FocusEventHandler,
  useContext,
} from 'react';
import { FormBucketContextValue } from '../types/FormBucketContextValue';
import { FormBucketContext } from './FormBucketContext';
import { validateField } from '../utils/validateField';

export const useFormBucket = <T extends object>() => {
  const { formBucket, setFormBucket } = useContext<FormBucketContextValue<T>>(
    FormBucketContext as unknown as Context<FormBucketContextValue<T>>
  );

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const name = ev.target.name as keyof T;
    const newVal = ev.target.value;

    setFormBucket({
      ...formBucket,
      values: {
        ...formBucket.values,
        [name]: ev.target.value,
      },
      errors: validateField(name, newVal, formBucket),
      hasChanged: true,
    });
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (ev) => {
    setFormBucket({
      ...formBucket,
      touched: {
        ...formBucket.touched,
        [ev.target.name]: true,
      },
    });
  };

  const getChangeHandler =
    (onChange?: ChangeEventHandler<HTMLInputElement>) => (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(ev);
      onChange && onChange(ev);
    };

  const getBlurHandler =
    (onChange?: FocusEventHandler<HTMLInputElement>) => (ev: FocusEvent<HTMLInputElement>) => {
      handleBlur(ev);
      onChange && onChange(ev);
    };

  const setValues = (values: T) => setFormBucket({ ...formBucket, values: { ...values } });

  return { formBucket, getChangeHandler, getBlurHandler, setValues };
};
