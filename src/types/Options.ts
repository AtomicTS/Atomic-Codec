
type OptionsUnknown = string | number | boolean | unknown;
export interface Options<T = OptionsUnknown> {
    parameter?: T;
}