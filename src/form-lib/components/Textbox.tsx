import type { ComponentProps } from 'react';
import { useFormBucket } from '../context/useFormBucket';

interface TextboxProps extends ComponentProps<'input'> {
  label: string;
  name: string;
}

/**
 * Basic input component
 * @param props Accepts all props an HTMLInputElement would accept
 * @param props.label label displayed above the input.
 */
export const Textbox: React.FC<TextboxProps> = ({
  label,
  name,
  className,
  onChange,
  onBlur,
  ...props
}) => {
  const { formBucket, getChangeHandler, getBlurHandler } = useFormBucket();

  const data = formBucket.values as Record<string, string>;
  const touched = formBucket.touched as Record<string, boolean>;
  const errors = formBucket.errors as Record<string, string>;

  const shouldShowError = !!(touched[name] && errors[name]);

  return (
    <div>
      <label>
        {label}
        <input
          {...props}
          className={`${className} ${shouldShowError ? 'textbox_invalid' : ''}`}
          name={name}
          value={data[name]}
          onChange={getChangeHandler(onChange)}
          onBlur={getBlurHandler(onBlur)}
        />
      </label>
      {shouldShowError && <div className="error">{errors[name][0]}</div>}
    </div>
  );
};
