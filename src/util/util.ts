export type BooleanSource = boolean | null | undefined | (() => BooleanSource);

export function toBoolean(value: BooleanSource, defaultValue: boolean = true): boolean {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return defaultValue;
    return toBoolean(value(), defaultValue);
}

export function error(description: string): never {
    throw new Error(description);
}

export function idMapping<Spec extends { id: number }, T,
    Constructor extends { new(spec: Spec, index: number): T }
>(specs: Spec[], T: Constructor): Record<number, T> {
    let result: Record<number, T> = [];
    for (let i = 0; i < specs.length; i++) {
        result[specs[i].id] = new T(specs[i], i);
    }
    return result;
}