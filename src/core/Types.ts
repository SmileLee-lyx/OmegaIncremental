import { TrivialEffect } from "@/core/Effects.js";
import type { Scaling } from "@/core/math/price.js";
import type { TextId } from "@/text/text.js";
import type { FormattedText, FormattedTextArgs } from "@/util/format.js";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

export interface NamedItem {
    type: string;
    id: number;
    name: string;
    nameId?: TextId;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    hiddenTooltipId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    unlocked?: () => boolean;
    visible?: () => boolean;
    args: FormattedTextArgs;
}

export interface WithEffect {
    effect?: () => OmegaNum | null;
    effectOnEnable?: () => OmegaNum;
}

export interface WithPrice {
    price(): OmegaNum;
}

export interface WithDomEntity {
    extraClasses?: string | string[];
}

export interface NamedWithEffect extends WithEffect, NamedItem {
    effectDescriptionId?: TextId;
}

export interface NamedWithPrice extends WithPrice, NamedItem {
    priceDescriptionId: TextId;
}

export interface Upgrade extends NamedWithEffect, NamedWithPrice, WithDomEntity {
    type: 'upgrade';
    owner?: string;

    bought: boolean;

    buyable(): boolean;

    buy(): void;
}

export interface AbstractNamedWithEffectSpec {
    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    hiddenTooltipId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    effectOnEnable?: () => OmegaNumSource;
    visible?: () => boolean;
    unlocked?: () => boolean;
}

export abstract class AbstractNamedWithEffect<K extends string> implements NamedWithEffect {
    type: K;

    owner: string;
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    hiddenTooltipId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    visible?: () => boolean;
    unlocked?: () => boolean;

    args: FormattedTextArgs;

    constructor(type: K, spec: AbstractNamedWithEffectSpec, args: FormattedTextArgs) {
        this.type = type;

        this.owner = spec.owner;
        this.id = spec.id;
        this.name = spec.name;
        this.descriptionId = spec.descriptionId;
        this.hiddenDescriptionId = spec.hiddenDescriptionId;
        this.hiddenTooltipId = spec.hiddenTooltipId;
        this.dynamicDescriptionId = spec.dynamicDescriptionId;
        this.effectDescriptionId = spec.effectDescriptionId;
        this.visible = spec.visible;
        this.unlocked = spec.unlocked ?? spec.visible;

        this.args = args;
    }

    abstract effect?: () => OmegaNum | null;
}

export interface AbstractUpgradeSpec extends AbstractNamedWithEffectSpec {
    priceDescriptionId: TextId;

    price(): OmegaNumSource;

    buyEffect?: () => void;

    args?: Record<string, () => FormattedText>;
}

export abstract class AbstractUpgrade extends AbstractNamedWithEffect<'upgrade'>
    implements Upgrade {
    priceDescriptionId: TextId;
    effect?: () => OmegaNum | null;
    effectOnEnable?: () => OmegaNum;
    price: () => OmegaNum;
    buyEffect?: () => void;

    protected constructor(spec: AbstractUpgradeSpec) {
        super('upgrade', spec, {
            effect: () => this.effectOnEnable!!(),
            price: () => this.price(),
            ...spec.args,
        });
        this.priceDescriptionId = spec.priceDescriptionId;
        this.price = () => new OmegaNum(spec.price());
        this.buyEffect = spec.buyEffect;

        if (spec.effectOnEnable !== undefined) {
            this.effectOnEnable = () => new OmegaNum(spec.effectOnEnable!!());
            this.effect = function (): OmegaNum | null {
                if (this.bought) return this.effectOnEnable!!();
                return null;
            };
        }
    }

    abstract get bought(): boolean;
    abstract set bought(value: boolean);

    abstract buyable(): boolean;

    abstract buy(): void;
}

export interface Buyable extends NamedWithEffect, NamedWithPrice, WithDomEntity {
    type: 'buyable';
    effectFromCount?: (count: OmegaNum) => OmegaNum;
    effect?: () => OmegaNum;

    priceScaling: () => Scaling;

    owner?: string;

    boughtCount: OmegaNum;
    fullyBought?: () => boolean;

    buyable: () => boolean;
    buy: () => void;
    canBuyMax: () => boolean;
    buyMax: () => void;
}

export interface AbstractBuyableSpec extends AbstractNamedWithEffectSpec {
    priceDescriptionId: TextId;

    effectFromCount(count: OmegaNum): OmegaNum;

    priceScaling: () => Scaling;

    args?: Record<string, () => FormattedText>;
}

export abstract class AbstractBuyable extends AbstractNamedWithEffect<'buyable'>
    implements Buyable {
    priceDescriptionId: TextId;
    effectFromCount?: (_: OmegaNum) => OmegaNum;
    effect?: () => OmegaNum;
    priceScaling: () => Scaling;

    protected constructor(spec: AbstractBuyableSpec) {
        super('buyable', spec, {
            effect: () => this.effect!!(),
            count: () => this.boughtCount,
            price: () => this.price(),
            ...spec.args,
        });
        this.priceDescriptionId = spec.priceDescriptionId;
        this.effectFromCount = spec.effectFromCount;
        this.priceScaling = spec.priceScaling;

        if (this.effectFromCount !== undefined) {
            this.effect = function (): OmegaNum {
                return this.effectFromCount!!(this.boughtCount);
            };
        }
    }

    price(): OmegaNum {
        return this.priceScaling().price(this.boughtCount);
    }

    abstract get boughtCount(): OmegaNum;
    abstract set boughtCount(value: OmegaNum);

    abstract buyable(): boolean;

    abstract buy(): void;

    canBuyMax() {
        return false;
    }

    buyMax() {
        this.buy();
    }
}

export interface Reset extends NamedItem, WithDomEntity {
    owner: string;

    buyable(): boolean;

    buy(): void;
}

export interface HotkeyEvent {
    id: string;
    description: TextId;
    action: () => void;
}

export interface Achievement extends NamedWithEffect, WithDomEntity {
    type: 'achievement';

    buyCondition: () => boolean;

    buy(): void;

    bought: boolean;
}

export interface AbstractAchievementSpec extends AbstractNamedWithEffectSpec {
    args?: Record<string, () => FormattedText>;

    buyCondition: () => boolean;
}

export abstract class AbstractAchievement extends AbstractNamedWithEffect<'achievement'>
    implements Achievement {

    effect?: () => OmegaNum | null;
    effectOnEnable?: () => OmegaNum;

    buyCondition: () => boolean;

    constructor(spec: AbstractAchievementSpec) {
        super('achievement', spec, {
            effect: () => this.effect!!(),
            ...spec.args,
        });

        if (spec.effectOnEnable !== undefined) {
            this.effectOnEnable = () => new OmegaNum(spec.effectOnEnable!!());
            this.effect = function (): OmegaNum | null {
                if (this.bought) return this.effectOnEnable!!();
                return null;
            };
        }

        this.buyCondition = spec.buyCondition;
    }

    abstract bought: boolean;

    abstract buy(): void;
}

export interface Challenge extends NamedWithEffect, WithDomEntity {
    type: 'challenge';
    owner: string;

    targetDescriptionId: TextId;

    dynamicActionId: () => TextId;
    action: () => void;

    runningNerfOnEnable: Record<string, () => WithEffect>;
    runningNerf: (target: string) => WithEffect;

    fullyCompleted: boolean;
    completedCount: OmegaNum;
    maxCount: () => OmegaNum;

    isRunning: () => boolean;
    canComplete: () => boolean;
    countOnComplete: () => OmegaNum;
    start: () => void;
    exit: () => void;
}

interface AbstractChallengeSpec extends AbstractNamedWithEffectSpec {
    targetDescriptionId: TextId;
    dynamicActionId: () => TextId;
    args: Record<string, () => FormattedText>;

    action: () => void;
    runningNerfOnEnable: Record<string, () => WithEffect>;
}

export abstract class AbstractChallenge extends AbstractNamedWithEffect<'challenge'>
    implements Challenge {
    targetDescriptionId: TextId;
    dynamicActionId: () => TextId;

    runningNerfOnEnable: Record<string, () => WithEffect>;
    action: () => void;

    constructor(spec: AbstractChallengeSpec) {
        super('challenge', spec, spec.args);
        this.targetDescriptionId = spec.targetDescriptionId;
        this.dynamicActionId = spec.dynamicActionId;
        this.action = spec.action;
        this.runningNerfOnEnable = spec.runningNerfOnEnable;
    }

    runningNerf(target: string): WithEffect {
        let calcNerf = this.runningNerfOnEnable[target];
        return calcNerf === undefined ? TrivialEffect : calcNerf();
    }

    abstract effect?: () => OmegaNum | null;
    abstract fullyCompleted: boolean;
    abstract completedCount: OmegaNum;

    abstract maxCount(): OmegaNum;

    abstract isRunning(): boolean;

    abstract canComplete(): boolean;

    abstract countOnComplete(): OmegaNum;

    abstract start(): void;

    abstract exit(): void;
}

export abstract class AbstractChallengeSingle extends AbstractChallenge {
    effectOnEnable?: () => OmegaNum;
    effect?: () => OmegaNum | null;

    constructor(spec: AbstractChallengeSpec & {
        effectOnEnable?: () => OmegaNum;
    }) {
        super(spec);
        this.effectOnEnable = spec.effectOnEnable;
        if (this.effectOnEnable !== undefined) {
            this.effect = function (): OmegaNum | null {
                if (this.fullyCompleted) return this.effectOnEnable!!();
                return null;
            };
        }
    }

    get completedCount() {
        return this.fullyCompleted ? new OmegaNum(1) : new OmegaNum(0);
    }

    maxCount(): OmegaNum {
        return new OmegaNum(1);
    }

    countOnComplete(): OmegaNum {
        return this.canComplete() ? new OmegaNum(1) : new OmegaNum(0);
    }
}