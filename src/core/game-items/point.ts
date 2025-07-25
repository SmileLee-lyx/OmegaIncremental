import { registerHotkey } from "@/components/misc/global-keyboard-press.js";
import { Effects, TrivialEffect } from "@/core/Effects.js";
import A from "@/core/game-items/A.js";
import { GlobalMessages } from "@/core/global-messages.js";
import { type PartialRecordsData, player, type RecordsData } from "@/core/global-objects.js";
import { Exp2Scaling, type Scaling } from "@/core/math/price.js";
import { AbstractBuyable, AbstractUpgrade, type HotkeyEvent } from "@/core/Types.js";
import { text, type TextId } from "@/text/text.js";
import { getBit, setBit } from "@/util/bit-array.js";
import { type FormattedText, resolveFormattedText } from "@/util/format.js";
import { error, toBoolean } from "@/util/util.js";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

interface PointUpgradeSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    effectOnEnable?: () => OmegaNumSource;

    price(): OmegaNumSource;

    buyEffect?: () => void;
    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

class PointUpgrade extends AbstractUpgrade {
    index: number;

    constructor(spec: PointUpgradeSpec, index: number) {
        super({
            ...spec,
            owner: 'point',
            priceDescriptionId: 'price.point',
        });
        this.index = index;
    }

    override get bought(): boolean {
        return getBit(player.point.upgrades, this.index);
    }

    override set bought(value: boolean) {
        setBit(player.point.upgrades, this.index, value);
    }

    override buyable(): boolean {
        return toBoolean(this.unlocked?.bind(this), true) &&
            Point.points.gte(this.price());
    }

    override buy() {
        if (this.bought) return;
        if (!this.buyable()) return;
        Point.points = Point.points.sub(this.price());
        this.bought = true;
        if (this.buyEffect !== undefined) this.buyEffect();
    }
}

interface PointBuyableSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => TextId;
    effectDescriptionId?: TextId;

    effectFromCount(count: OmegaNum): OmegaNum;

    priceScaling: Scaling;

    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

class PointBuyable extends AbstractBuyable {
    index: number;

    constructor(spec: PointBuyableSpec, index: number) {
        super({
            ...spec,
            owner: 'point',
            priceDescriptionId: 'price.point-buyable',
        });
        this.index = index;
    }

    override get boughtCount(): OmegaNum {
        return player.point.buyables[this.id] ?? new OmegaNum(0);
    }

    override set boughtCount(value: OmegaNum) {
        player.point.buyables[this.id] = value;
    }

    override buyable(): boolean {
        return toBoolean(this.unlocked?.bind(this), true) &&
            Point.points.gte(this.price());
    }

    override buy() {
        if (!this.buyable()) return;
        Point.points = Point.points.sub(this.price());
        this.boughtCount = this.boughtCount.add(1);
    }
}

const pointUpgradeSpecs: PointUpgradeSpec[] = [
    {
        id: 11,
        name: 'pU11',
        descriptionId: 'pU11.description',
        effectOnEnable() { return 1; },
        price() { return 1; },
    },
    {
        id: 12,
        name: 'pU12',
        descriptionId: 'pU12.description',
        effectOnEnable() {
            return 3;
        },
        price() { return 10; },

        visible() {
            return Point.U(11).bought;
        },
    },
    {
        id: 13,
        name: 'pU13',
        descriptionId: 'pU13.description',
        hiddenDescriptionId: 'pU13.hidden-description',
        effectDescriptionId: 'effect.simple-mul',
        effectOnEnable() {
            return Point.points.max(1).log10().add(1);
        },
        price() { return 30; },

        visible() {
            return Point.U(11).bought;
        },

        buyEffect() {
            if (!player.game.shownAlerts.includes('hold-shift')) {
                GlobalMessages.addMessage({
                    'type': 'alert',
                    messageText: resolveFormattedText(text('hint.hold-shift')),
                });
                player.game.shownAlerts.push('hold-shift');
            }
        },
    },
    {
        id: 14,
        name: 'pU14',
        descriptionId: 'pU14.description',
        price() { return 100; },

        visible() {
            return Point.U(11).bought;
        },
    },
    {
        id: 15,
        name: 'pU15',
        descriptionId: 'pU15.description',
        price() { return 5000; },

        visible() {
            return Point.U(11).bought;
        },
    },
    {
        id: 21,
        name: 'pU21',
        descriptionId: 'pU21.description',
        effectOnEnable() { return 10; },
        price() { return 5e8; },

        visible() {
            return Point.U(15).bought;
        },
    },
    {
        id: 22,
        name: 'pU22',
        descriptionId: 'pU22.description',
        effectOnEnable() { return 10; },
        price() { return 1e13; },

        visible() {
            return Point.U(15).bought;
        },
    },
    {
        id: 23,
        name: 'pU23',
        descriptionId: 'pU23.description',
        effectOnEnable() { return 100; },
        price() { return 1e23; },

        visible() {
            return Point.U(15).bought;
        },
    },
    {
        id: 24,
        name: 'pU24',
        descriptionId: 'pU24.description',
        effectOnEnable() { return 1e6; },
        price() { return 1e50; },

        visible() {
            return Point.U(15).bought;
        },
    },
    {
        id: 25,
        name: 'pU25',
        descriptionId: 'pU25.description',

        dynamicDescriptionId(): TextId {
            return player.A.unlocked ? 'pU25.description-after-unlock' : 'pU25.description';
        },

        price() { return 1e80; },

        visible() {
            return Point.U(15).bought;
        },

        buyEffect() {
            player.A.unlocked = true;
        },
    },
    {
        id: 31,
        name: 'pU31',
        descriptionId: 'pU31.description',
        effectOnEnable() { return 1e3; },
        price() { return 1e80; },

        visible() {
            return A.U(14).bought;
        },
    },
    {
        id: 32,
        name: 'pU32',
        descriptionId: 'pU32.description',
        effectOnEnable() { return 1e5; },
        price() { return 1e120; },

        visible() {
            return A.U(21).bought;
        },
    },
];

const pointBuyableSpecs: PointBuyableSpec[] = [
    {
        id: 1,
        name: 'pB1',
        descriptionId: 'pB1.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling(1, 10, Number.MAX_VALUE, 10),
        visible() {
            return Point.U(14).bought;
        },
    },
    {
        id: 2,
        name: 'pB2',
        descriptionId: 'pB2.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling(100, 100, Number.MAX_VALUE, 10),
        visible() {
            return Point.U(15).bought;
        },
    },
    {
        id: 3,
        name: 'pB3',
        descriptionId: 'pB3.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling('1e6', 1000, Number.MAX_VALUE, 10),
        visible() {
            return Point.U(22).bought;
        },
    },
    {
        id: 4,
        name: 'pB4',
        descriptionId: 'pB4.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling('1e10', '1e5', Number.MAX_VALUE, 10),
        visible() {
            return Point.U(23).bought;
        },
    },
    {
        id: 0,
        name: 'pB0',
        descriptionId: 'pB0.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(1.1).pow(count);
        },
        priceScaling: new Exp2Scaling(10, 10, Number.MAX_VALUE, 10),
        visible() {
            return Point.U(21).bought;
        },
    },
    {
        id: 5,
        name: 'pB5',
        descriptionId: 'pB5.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling('1e40', '1e8', Number.MAX_VALUE, 10),
        visible() {
            return Point.U(31).bought;
        },
    },
    {
        id: 6,
        name: 'pB6',
        descriptionId: 'pB6.description',
        effectDescriptionId: 'effect.simple-mul',
        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },
        priceScaling: new Exp2Scaling('1e120', '1e10', Number.MAX_VALUE, 10),
        visible() {
            return Point.U(32).bought;
        },
    },
];

const pointUpgrades: Record<number, PointUpgrade> = [];
for (let i = 0; i < pointUpgradeSpecs.length; i++) {
    pointUpgrades[pointUpgradeSpecs[i].id] = new PointUpgrade(pointUpgradeSpecs[i], i);
}
const pointBuyables: Record<number, PointBuyable> = [];
for (let i = 0; i < pointBuyableSpecs.length; i++) {
    pointBuyables[pointBuyableSpecs[i].id] = new PointBuyable(pointBuyableSpecs[i], i);
}

const Point = {
    get points(): OmegaNum {
        return player.point.points;
    },
    set points(value: OmegaNum) {
        player.point.points = value;
    },

    booster(layer: number) {
        return {
            get amount(): OmegaNum {
                return player.point.boosters[layer - 1] ?? new OmegaNum(0);
            },
            set amount(value: OmegaNum) {
                player.point.boosters[layer - 1] = value;
            },
            effect(): OmegaNum {
                return this.amount.max(1);
            },
            unlocked(): boolean {
                switch (layer) {
                    case 1:
                        return Point.U(15).bought;
                    case 2:
                        return Point.U(22).bought;
                    case 3:
                        return Point.U(23).bought;
                    case 4:
                        return Point.U(31).bought;
                    case 5:
                        return Point.U(32).bought;
                }
                return false;
            },
            associatedBuyable(): PointBuyable | undefined {
                switch (layer) {
                    case 1:
                        return Point.B(2);
                    case 2:
                        return Point.B(3);
                    case 3:
                        return Point.B(4);
                    case 4:
                        return Point.B(5);
                    case 5:
                        return Point.B(6);
                }
                return undefined;
            },
            amountPerSecond(): OmegaNum {
                if (!this.unlocked()) return new OmegaNum(0);
                let result = new OmegaNum(1);
                result = result.mul(Effects.prod(
                    Point.booster(layer + 1),
                    this.associatedBuyable() ?? TrivialEffect,
                    Point.B(0),

                    A.U(12), A.U(13),
                ));
                return result;
            },
        };
    },

    upgrades: Object.values(pointUpgrades),
    U(id: number): PointUpgrade {
        return pointUpgrades[id] ?? error('id not exist');
    },

    buyables: Object.values(pointBuyables),
    B(id: number): PointBuyable {
        return pointBuyables[id] ?? error('id not exist');
    },

    pointPerSecond(): OmegaNum {
        if (!Point.U(11).bought) return new OmegaNum(0);
        let result = Effects.sum(Point.U(11));
        result = result.mul(Effects.prod(
            Point.U(12), Point.U(13),
            Point.U(21), Point.U(22), Point.U(23), Point.U(24),
            Point.B(1), Point.B(0),
            Point.booster(1),

            A.U(11), A.U(12), A.U(13),
            Point.U(31), Point.U(32),
        ));
        return result;
    },

    buyableHotkey: {
        id: 'point.buyable',
        description: 'hotkey.point-buyable',
        action() {
            if (!player.automation.point.hotkeyBuyable.unlocked) return;
            for (let b of Point.buyables) {
                b.buy();
            }
        },
    } satisfies HotkeyEvent,

    init() {
        let hotkeyBuyable = player.automation.point.hotkeyBuyable;
        if (hotkeyBuyable.key !== undefined) {
            registerHotkey(hotkeyBuyable.key, Point.buyableHotkey);
        }
    },

    gameLoop(duration: number) {
        Point.points = Point.points.add(
            Point.pointPerSecond().mul(duration));
        for (let i = 1; i <= 5; ++i) {
            Point.booster(i).amount = Point.booster(i).amount.add(
                Point.booster(i).amountPerSecond().mul(duration));
        }

        Point.updateRecords();
    },

    updateRecordLayer(data: PartialRecordsData) {
        if (data.point === undefined) data.point = {};
        if (data.point.points === undefined) data.point.points = new OmegaNum(1);
        data.point.points = data.point.points.max(Point.points);
    },

    updateRecords() {
        this.updateRecordLayer(player.records.historical);
        let level: keyof RecordsData;
        for (level in player.records.current) {
            if (level !== 'point') {
                this.updateRecordLayer(player.records.current[level]);
            }
        }
    },
};

export default Point;

(window as any).Point = Point;