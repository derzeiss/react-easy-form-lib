import { ValidatorFunction } from './ValidatorFunction';

export type ValidatorsFor<T extends object> = { [key in keyof T]?: ValidatorFunction[] };
