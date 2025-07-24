import type { Scaling } from "@/core/math/price.js";
import type { TextId } from "@/text/text.js";
import type { FormattedText } from "@/util/format.js";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

export interface NamedItem {
    type: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    unlocked?: () => boolean;
    visible?: () => boolean;
    args: Record<string, () => FormattedText>;
}

export interface WithEffect {
    effect?: () => OmegaNum | null;
    effectOnEnable?: () => OmegaNum;
}

export interface WithPrice {
    price(): OmegaNum;
}

export interface NamedWithEffect extends WithEffect, NamedItem {
    effectDescriptionId?: TextId;
}

export interface NamedWithPrice extends WithPrice, NamedItem {
    priceDescriptionId: TextId;
}

export interface Achievement extends NamedWithEffect {
    type: 'achievement';

    unlockCondition(): boolean;

    hasEffect: boolean;
}

export interface Upgrade extends NamedWithEffect, NamedWithPrice {
    type: 'upgrade';
    owner?: string;

    bought: boolean;

    buyable(): boolean;

    buy(): void;
}

export interface AbstractUpgradeSpec {
    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    effectOnEnable?: () => OmegaNumSource;
    priceDescriptionId: TextId;

    price(): OmegaNumSource;

    buyEffect?: () => void;
    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

export abstract class AbstractUpgrade implements Upgrade {
    type: 'upgrade' = 'upgrade';
    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    priceDescriptionId: TextId;
    effect?: () => OmegaNum | null;
    effectOnEnable?: () => OmegaNum;
    price: () => OmegaNum;
    visible?: () => boolean;
    unlocked?: () => boolean;
    buyEffect?: () => void;
    args: Record<string, () => FormattedText>;

    protected constructor(spec: AbstractUpgradeSpec) {
        this.owner = spec.owner;
        this.id = spec.id;
        this.name = spec.name;
        this.descriptionId = spec.descriptionId;
        this.hiddenDescriptionId = spec.hiddenDescriptionId;
        this.dynamicDescriptionId = spec.dynamicDescriptionId;
        this.effectDescriptionId = spec.effectDescriptionId;
        if (spec.effectOnEnable !== undefined) {
            this.effectOnEnable = () => new OmegaNum(spec.effectOnEnable!!());
        } else {
            this.effectOnEnable = undefined;
        }
        this.priceDescriptionId = spec.priceDescriptionId;
        this.price = () => new OmegaNum(spec.price());
        this.visible = spec.visible;
        this.unlocked = spec.unlocked ?? spec.visible;
        this.buyEffect = spec.buyEffect;

        if (this.effectOnEnable !== undefined) {
            this.effect = function (): OmegaNum | null {
                if (this.bought) return this.effectOnEnable!!();
                return null;
            };
        }

        this.args = spec.args ?? {
            effect: () => this.effectOnEnable!!(),
            price: () => this.price(),
        };
    }

    abstract get bought(): boolean;
    abstract set bought(value: boolean);

    abstract buyable(): boolean;

    abstract buy(): void;
}

export interface Buyable extends NamedWithEffect, NamedWithPrice {
    type: 'buyable';
    effectFromCount?: (count: OmegaNum) => OmegaNum;
    effect?: () => OmegaNum;

    priceScaling: Scaling;

    owner?: string;

    boughtCount: OmegaNum;
    fullyBought?: () => boolean;

    buyable(): boolean;

    buy(): void;
}

export interface AbstractBuyableSpec {
    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => TextId;
    effectDescriptionId?: TextId;
    priceDescriptionId: TextId;

    effectFromCount(count: OmegaNum): OmegaNum;

    priceScaling: Scaling;

    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

export abstract class AbstractBuyable implements Buyable {
    type: 'buyable' = 'buyable';
    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => TextId;
    effectDescriptionId?: TextId;
    priceDescriptionId: TextId;
    effectFromCount?: (_: OmegaNum) => OmegaNum;
    effect?: () => OmegaNum;
    priceScaling: Scaling;
    visible?: () => boolean;
    unlocked?: () => boolean;
    args: Record<string, () => FormattedText>;

    constructor(spec: AbstractBuyableSpec) {
        this.owner = spec.owner;
        this.id = spec.id;
        this.name = spec.name;
        this.descriptionId = spec.descriptionId;
        this.hiddenDescriptionId = spec.hiddenDescriptionId;
        this.dynamicDescriptionId = spec.dynamicDescriptionId;
        this.effectDescriptionId = spec.effectDescriptionId;
        this.priceDescriptionId = spec.priceDescriptionId;
        this.effectFromCount = spec.effectFromCount;
        this.priceScaling = spec.priceScaling;
        this.visible = spec.visible;
        this.unlocked = spec.unlocked ?? spec.visible;

        if (this.effectFromCount !== undefined) {
            this.effect = function (): OmegaNum {
                return this.effectFromCount!!(this.boughtCount);
            };
        }

        this.args = spec.args ?? {
            effect: () => this.effect!!(),
            count: () => this.boughtCount,
            price: () => this.price(),
        };
    }

    price(): OmegaNum {
        return this.priceScaling.price(this.boughtCount);
    }

    abstract get boughtCount(): OmegaNum;
    abstract set boughtCount(value: OmegaNum);

    abstract buyable(): boolean;

    abstract buy(): void;
}

export interface Reset extends NamedItem {
    owner: string;

    buyable(): boolean;

    buy(): void;
}

export interface AbstractResetSpec {
    id: number;
    name: string;
    owner: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    visible?: () => boolean;
    unlocked?: () => boolean;
    args: Record<string, () => OmegaNum>;
}

export abstract class AbstractReset implements Reset {
    type: 'reset' = 'reset';
    id: number;
    name: string;
    owner: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    visible?: () => boolean;
    unlocked?: () => boolean;
    args: Record<string, () => OmegaNum>;

    constructor(spec: AbstractResetSpec) {
        this.id = spec.id;
        this.name = spec.name;
        this.owner = spec.owner;
        this.descriptionId = spec.descriptionId;
        this.hiddenDescriptionId = spec.hiddenDescriptionId;
        this.visible = spec.visible;
        this.unlocked = spec.unlocked ?? spec.visible;
        this.args = spec.args;
    }

    abstract buyable(): boolean

    abstract buy(): void
}

export interface HotkeyEvent {
    id: string;
    description: TextId;
    action: () => void;
}