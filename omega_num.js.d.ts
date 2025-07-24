declare module 'omega_num.js' {
    export type OmegaNumSource = number | bigint | string | OmegaNum;

    class OmegaNum {
        static maxArrow: number;
        static serializeMode: 0 | 1;
        static debug: 0 | 1 | 2;

        static ZERO: OmegaNum;

        constructor(source: OmegaNumSource);
        constructor(array: Array<number>, sign?: number);

        readonly sign: number;
        readonly array: Array<number>;

        cmp(other: OmegaNumSource): number;
        compareTo(other: OmegaNumSource): number;
        gt(other: OmegaNumSource): boolean;
        greaterThan(other: OmegaNumSource): boolean;
        gte(other: OmegaNumSource): boolean;
        greaterThanOrEqualTo(other: OmegaNumSource): boolean;
        lt(other: OmegaNumSource): boolean;
        lessThan(other: OmegaNumSource): boolean;
        lte(other: OmegaNumSource): boolean;
        lessThanOrEqualTo(other: OmegaNumSource): boolean;
        eq(other: OmegaNumSource): boolean;
        equalsTo(other: OmegaNumSource): boolean;
        neq(other: OmegaNumSource): boolean;
        notEqualsTo(other: OmegaNumSource): boolean;

        ispos(): boolean;
        isPositive(): boolean;
        isneg(): boolean;
        isNegative(): boolean;
        isNaN(): boolean;
        isFinite(): boolean;
        isInfinite(): boolean;
        isint(): boolean;
        isInteger(): boolean;

        abs(): OmegaNum;
        absoluteValue(): OmegaNum;
        neg(): OmegaNum;
        negate(): OmegaNum;

        min(other: OmegaNumSource): OmegaNum;
        minimum(other: OmegaNumSource): OmegaNum;
        max(other: OmegaNumSource): OmegaNum;
        maximum(other: OmegaNumSource): OmegaNum;

        floor(): OmegaNum;
        ceiling(): OmegaNum;
        ceil(): OmegaNum;
        round(): OmegaNum;

        plus(other: OmegaNumSource): OmegaNum;
        add(other: OmegaNumSource): OmegaNum;
        minus(other: OmegaNumSource): OmegaNum;
        sub(other: OmegaNumSource): OmegaNum;
        times(other: OmegaNumSource): OmegaNum;
        mul(other: OmegaNumSource): OmegaNum;
        divide(other: OmegaNumSource): OmegaNum;
        div(other: OmegaNumSource): OmegaNum;
        modular(other: OmegaNumSource): OmegaNum;
        mod(other: OmegaNumSource): OmegaNum;
        reciprocate(): OmegaNum;
        rec(): OmegaNum;
        gamma(): OmegaNum;
        factorial(): OmegaNum;
        toPower(other: OmegaNumSource): OmegaNum;
        pow(other: OmegaNumSource): OmegaNum;
        exponential(): OmegaNum;
        exp(): OmegaNum;
        root(other: OmegaNumSource): OmegaNum;
        squareRoot(): OmegaNum;
        sqrt(): OmegaNum;
        cubeRoot(): OmegaNum;
        cbrt(): OmegaNum;

        logBase(base: OmegaNumSource): OmegaNum;
        log10(): OmegaNum;
        ln(): OmegaNum;

        lambertw(principal?: boolean): OmegaNum;

        tetrate(other: OmegaNumSource, payload?: OmegaNum): OmegaNum;
        ssqrt(): OmegaNum;
        slog(base: OmegaNumSource): OmegaNum;

        pentate(other: OmegaNumSource): OmegaNum;
        arrow(arrows: number): (other: OmegaNumSource) => OmegaNum;
        chain(other: OmegaNumSource, arrows: number): OmegaNum;

        toNumber(): number;
        toString(): string;
        toStringWithDecimalPlaces(places: number, applyToOpNums?: boolean): string
        toExponential(places: number, applyToOpNums?: boolean): string;
        toFixed(places: number, applyToOpNums?: boolean): string;
        toPrecision(places: number, applyToOpNums?: boolean): string;
        toHyperE(): string
        valueOf(): string;

        toJSON(): string;
    }

    export default OmegaNum;
}