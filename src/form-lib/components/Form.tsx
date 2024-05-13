import { FormEvent, ReactNode, useState } from 'react';
import { FormBucketContext } from '../context/FormBucketContext';
import { FormBucket } from '../types/FormBucket';
import { ValidatorsFor } from '../types/ValidatorsFor';
import { validateField } from '../utils/validateField';

const _getInitialFormBucketValue = <T extends object>(
  initialValues: T,
  validators?: ValidatorsFor<T>
) => {
  const formBucket: FormBucket<T> = {
    values: initialValues,
    hasChanged: false,
    isSubmitting: false,
    touched: {},
    errors: {},
    validators: validators || {},
    initialValues: JSON.parse(JSON.stringify(initialValues)) as T,
  };

  if (validators) {
    formBucket.errors = Object.keys(validators).reduce((errors, name) => {
      const name_typed = name as keyof T;
      const err = validateField(name_typed, formBucket.values[name_typed] + '', formBucket);
      return { ...errors, ...err };
    }, {});
  }

  return formBucket;
};

interface FormProps<T extends object> {
  /** Initial form value */
  initialValues: T;
  /** object of validators for form */
  validators?: ValidatorsFor<T>;
  /**
   * Form submit handler.
   * @param formBucket current form bucket, containing e.g. current values
   */
  onFormSubmit: (formBucket: FormBucket<T>) => void | Promise<unknown>;
  /** children can be either a default {@link ReactNode} or a render-function */
  children?: ReactNode | ((formBucket: FormBucket<T>) => ReactNode);

  /** HTML-PROPS */
  className?: string;
}

/**
 * Form component that provides a {@link FormBucketContext} to all children.
 * Will call onFormSubmit on submit instead of onSubmit.
 */
export const Form = <T extends object>({
  initialValues,
  validators,
  onFormSubmit,
  children,
  ...props
}: FormProps<T>) => {
  const [formBucket, setFormBucket] = useState<FormBucket<T>>(
    _getInitialFormBucketValue(initialValues, validators)
  );

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // set all (known) fields touched
    const touched = Object.keys(formBucket.values)
      .concat(Object.keys(formBucket.validators))
      .reduce((touched, name) => {
        const name_typed = name as keyof T;
        return { ...touched, [name_typed]: true };
      }, {});
    setFormBucket({ ...formBucket, touched });

    // don't submit if there are any validation errors
    if (Object.values(formBucket.errors).some((e) => !!e)) return;

    // run lib-user specified behavior
    setFormBucket({ ...formBucket, isSubmitting: true });
    const promiseSubmit = onFormSubmit(formBucket) || Promise.resolve();

    // reset form bucket after submit is complete
    promiseSubmit.finally(() => {
      setFormBucket({
        ...formBucket,
        touched: {},
        errors: {},
        hasChanged: false,
        isSubmitting: false,
        initialValues: { ...formBucket.values },
      });
    });
  };

  return (
    <FormBucketContext.Provider
      value={{
        formBucket: formBucket,
        setFormBucket: setFormBucket as (newBucket: FormBucket<object>) => void,
      }}
    >
      <form {...props} onSubmit={handleSubmit}>
        {children && typeof children === 'function' ? children(formBucket) : children}
      </form>
    </FormBucketContext.Provider>
  );
};
