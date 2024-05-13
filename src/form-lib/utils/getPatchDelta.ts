export const getPatchDelta = <T extends { [key in keyof T]: unknown }>(
  prevValues: T,
  formValues: T
) => {
  return Object.keys(prevValues) // using prevValues here to omit keys added in formValues
    .filter((key) => {
      const key_typed = key as keyof T;
      return prevValues[key_typed] !== formValues[key_typed];
    })
    .reduce((patchObj, key) => {
      const key_typed = key as keyof T;
      patchObj[key_typed] = formValues[key_typed];
      return patchObj;
    }, {} as Record<keyof T, unknown>) as Partial<T>;
};
