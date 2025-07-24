import OmegaNum, { type OmegaNumSource } from "omega_num.js";

export interface Scaling {
    price(count: OmegaNum): OmegaNum;

    maxBuyable(currency: OmegaNum): OmegaNum;
}

export class ExpScaling implements Scaling {
    start: OmegaNum;
    raise: OmegaNum;

    constructor(start: OmegaNumSource, raise: OmegaNumSource) {
        this.start = new OmegaNum(start);
        this.raise = new OmegaNum(raise);
    }

    price(count: OmegaNum): OmegaNum {
        return this.start.mul(this.raise.pow(count));
    }

    maxBuyable(currency: OmegaNum): OmegaNum {
        if (currency.lt(this.start)) {
            return new OmegaNum(0);
        }
        return currency.div(this.start).logBase(this.raise);
    }
}

(window as any).ExpScaling = ExpScaling;

export class Exp2Scaling implements Scaling {
    start: OmegaNum;
    raise: OmegaNum;
    start2: OmegaNum;
    raise2: OmegaNum;

    thresholdCount: OmegaNum;

    constructor(start: OmegaNumSource, raise: OmegaNumSource, start2: OmegaNumSource, raise2: OmegaNumSource) {
        this.start = new OmegaNum(start);
        this.raise = new OmegaNum(raise);
        this.start2 = new OmegaNum(start2);
        this.raise2 = new OmegaNum(raise2);

        this.thresholdCount = this.start2.div(this.start).logBase(this.raise);
    }

    price(count: OmegaNum): OmegaNum {
        if (count.lt(this.thresholdCount)) {
            return this.start.mul(this.raise.pow(count));
        }
        return this.start.mul(this.raise.pow(count))
            .mul(this.raise2.pow((count.sub(this.thresholdCount).pow(2).div(2))));
    }

    maxBuyable(currency: OmegaNum): OmegaNum {
        if (currency.lt(this.start)) {
            return new OmegaNum(0);
        }
        if (currency.lt(this.start2)) {
            return currency.div(this.start).logBase(this.raise);
        }
        return this.thresholdCount.add(
            currency.div(this.start2).logBase(this.raise2).mul(2).add(this.raise.logBase(this.raise2).pow(2))
                .sqrt().sub(this.raise.logBase(this.raise2))
        )
    }
}

(window as any).Exp2Scaling = Exp2Scaling;