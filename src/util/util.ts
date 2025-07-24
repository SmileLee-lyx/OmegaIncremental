import OmegaNum from "omega_num.js";

export type BooleanSource = boolean | null | undefined | (() => BooleanSource);

export function toBoolean(value: BooleanSource, defaultValue: boolean = true): boolean {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return defaultValue;
    return toBoolean(value(), defaultValue);
}

export function error(description: string): never {
    throw new Error(description);
}