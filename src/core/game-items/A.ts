import { registerHotkey } from "@/core/misc/hotkey.js";
import { Effects } from "@/core/Effects.js";
import Ach from "@/core/game-items/achievement.js";
import Point from "@/core/game-items/point.js";
import { alertOnce, GlobalMessages } from "@/core/global-messages.js";
import { type PartialRecordsData, player, type RecordsData } from "@/core/global-objects.js";
import { Exp2Scaling, ExpScaling, type Scaling } from "@/core/math/price.js";
import {
    AbstractBuyable,
    AbstractChallengeSingle,
    AbstractUpgrade,
    type HotkeyEvent,
    type Reset,
    type WithEffect,
} from "@/core/Types.js";
import { text, type TextId } from "@/text/text.js";
import { getBit, setBit } from "@/util/bit-array.js";
import { type FormattedText, resolveFormattedText } from "@/util/format.js";
import { error, idMapping, toBoolean } from "@/util/util.js";
import _ from "lodash";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

interface AUpgradeSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    hiddenTooltipId?: TextId;
    dynamicDescriptionId?: () => TextId;
    effectDescriptionId?: TextId;
    effectOnEnable?: () => OmegaNumSource;

    price(): OmegaNumSource;

    buyEffect?: () => void;
    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

class AUpgrade extends AbstractUpgrade {
    index: number;
    extraClasses = 'A-button';

    constructor(spec: AUpgradeSpec, index: number) {
        super({ ...spec, owner: 'A', priceDescriptionId: 'price.A' });
        this.index = index;
    }

    get bought(): boolean {
        return getBit(player.A.upgrades, this.index);
    }

    set bought(value: boolean) {
        setBit(player.A.upgrades, this.index, value);
    }

    buyable(): boolean {
        if (!toBoolean(this.unlocked, true)) return false;
        return A.points.gte(this.price());
    }

    buy(): void {
        if (!this.buyable()) return;
        A.points = A.points.sub(this.price());
        this.bought = true;
        if (this.buyEffect !== undefined) this.buyEffect();
    }
}

interface ABuyableSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => TextId;
    effectDescriptionId?: TextId;

    effectFromCount(count: OmegaNum): OmegaNum;

    priceScaling: () => Scaling;

    visible?: () => boolean;
    unlocked?: () => boolean;

    args?: Record<string, () => FormattedText>;
}

class ABuyable extends AbstractBuyable {
    index: number;
    extraClasses = 'A-button';

    constructor(spec: ABuyableSpec, index: number) {
        super({
            ...spec,
            owner: 'point',
            priceDescriptionId: 'price.A-buyable',
        });
        this.index = index;
    }

    override get boughtCount(): OmegaNum {
        return player.A.buyables[this.id] ?? new OmegaNum(0);
    }

    override set boughtCount(value: OmegaNum) {
        player.A.buyables[this.id] = value;
    }

    override buyable(): boolean {
        return toBoolean(this.unlocked?.bind(this), true) &&
            A.points.gte(this.price());
    }

    override buy() {
        if (!this.buyable()) return;
        A.points = A.points.sub(this.price());
        this.boughtCount = this.boughtCount.add(1);
    }
}

interface AChallengeSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
    dynamicDescriptionId?: () => (TextId | undefined);
    effectDescriptionId?: TextId;
    visible?: () => boolean;
    unlocked?: () => boolean;
    args?: Record<string, () => FormattedText>;

    targetPoint: OmegaNum;

    effectOnEnable?: () => OmegaNum;
    runningNerfOnEnable: Record<string, () => WithEffect>;
}

class AChallenge extends AbstractChallengeSingle {
    index: number;
    extraClasses = 'A-button';

    targetPoint: OmegaNum;

    constructor(spec: AChallengeSpec, index: number) {
        super({
            ...spec,
            owner: 'A',
            args: {
                effect: () => this.effectOnEnable!!(),
                'target-point': () => this.targetPoint,
            },

            targetDescriptionId: 'A.challenge.target',

            dynamicActionId(this: AChallenge): TextId {
                if (!toBoolean(this.unlocked, true)) {
                    return 'challenge.start-not-unlocked';
                }
                if (this.isRunning()) {
                    return 'A.challenge.exit';
                }
                if (this.fullyCompleted) {
                    return 'A.challenge.completed';
                }
                return 'A.challenge.start';
            },

            action(this: AChallenge) {
                if (!toBoolean(this.unlocked, true)) return;
                if (this.isRunning()) {
                    this.exit();
                } else {
                    this.start();
                }
            },
        });
        this.index = index;
        this.targetPoint = spec.targetPoint;
    }

    get fullyCompleted(): boolean {
        return getBit(player.A.challengeCompletions, this.index);
    }

    set fullyCompleted(value: boolean) {
        setBit(player.A.challengeCompletions, this.index, value);
    }

    isRunning(): boolean {
        return player.A.runningChallenge === this.id;
    }

    start(): void {
        if (this.isRunning()) return;
        A.reset.forceBuy();
        player.A.runningChallenge = this.id;
    }

    exit(): void {
        if (!this.isRunning()) return;
        A.resetImpl();
        player.A.runningChallenge = undefined;
    }

    public canComplete(): boolean {
        return Point.points.gte(this.targetPoint);
    }
}

const upgradeSpecs: AUpgradeSpec[] = [
    {
        id: 11,
        name: 'AU11',
        descriptionId: 'AU11.description',
        hiddenDescriptionId: 'AU11.hidden-description',
        effectDescriptionId: 'effect.simple-mul',
        effectOnEnable() {
            // TODO: replace by B.gameTime
            let gameTime: OmegaNum = player.records.historical.point.gameTime;
            return gameTime.max(1).log10().add(1).pow(3);
        },
        price() { return 1; },
    },
    {
        id: 12,
        name: 'AU12',
        descriptionId: 'AU12.description',
        hiddenDescriptionId: 'AU12.hidden-description',
        effectDescriptionId: 'effect.simple-mul',
        effectOnEnable() {
            return A.resetTimes.add(1);
        },
        price() {
            return 1.05;
        },
    },
    {
        id: 13,
        name: 'AU13',
        descriptionId: 'AU13.description',
        hiddenDescriptionId: 'AU13.hidden-description',
        effectDescriptionId: 'effect.simple-mul',
        effectOnEnable() {
            return A.points.add(1).log10().add(1).pow(3);
        },
        price() {
            return 3;
        },
    },
    {
        id: 14,
        name: 'AU14',
        descriptionId: 'AU14.description',
        price() {
            return 5;
        },
    },
    {
        id: 15,
        name: 'AU15',
        descriptionId: 'AU15.description',
        price() {
            return 1.1;
        },
        buyEffect() {
            player.automation.point.hotkeyBuyable.unlocked = true;

            if (!player.game.shownAlerts.includes('mouse-trigger-hotkey')) {
                GlobalMessages.addMessage({
                    'type': 'alert',
                    messageText: resolveFormattedText(text('hint.mouse-trigger-hotkey')),
                });
                player.game.shownAlerts.push('mouse-trigger-hotkey');
            }
        },
    },
    {
        id: 21,
        name: 'AU21',
        descriptionId: 'AU21.description',
        price() {
            return 20;
        },

        visible() {
            return A.U(11).bought && A.U(12).bought &&
                A.U(13).bought && A.U(14).bought && A.U(15).bought;
        },
    },
    {
        id: 22,
        name: 'AU22',
        descriptionId: 'AU22.description',
        price() {
            return 100;
        },
        visible() {
            return A.U(11).bought && A.U(12).bought &&
                A.U(13).bought && A.U(14).bought && A.U(15).bought;
        },
    },
    {
        id: 23,
        name: 'AU23',
        descriptionId: 'AU23.description',
        hiddenDescriptionId: 'AU23.hidden-description',
        effectDescriptionId: 'effect.simple-mul',
        price() {
            return 300;
        },
        visible() {
            return A.U(11).bought && A.U(12).bought &&
                A.U(13).bought && A.U(14).bought && A.U(15).bought;
        },
        effectOnEnable(): OmegaNumSource {
            return new OmegaNum(Ach.amount.value).max(1).pow(3);
        },
    },
    {
        id: 24,
        name: 'AU24',
        descriptionId: 'AU24.description',
        hiddenDescriptionId: 'AU24.hidden-description',
        hiddenTooltipId: 'AU24.hidden-tooltip',
        price() {
            return 500;
        },
        visible() {
            return A.U(11).bought && A.U(12).bought &&
                A.U(13).bought && A.U(14).bought && A.U(15).bought;
        },
    },
    {
        id: 25,
        name: 'AU25',
        descriptionId: 'AU25.description',
        hiddenDescriptionId: 'AU25.hidden-description',
        price() {
            return 2000;
        },
        visible() {
            return A.U(11).bought && A.U(12).bought &&
                A.U(13).bought && A.U(14).bought && A.U(15).bought;
        },
    },
];

const buyableSpecs: ABuyableSpec[] = [
    {
        id: 1,
        name: 'AB1',
        descriptionId: 'AB1.description',
        effectDescriptionId: 'effect.simple-mul',

        visible() {
            return A.C(1).fullyCompleted;
        },

        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(2).pow(count);
        },

        priceScaling: () => new ExpScaling('10', '10'),
    },
    {
        id: 2,
        name: 'AB2',
        descriptionId: 'AB2.description',
        effectDescriptionId: 'effect.simple-mul',

        visible() {
            return A.C(4).fullyCompleted;
        },

        effectFromCount(count: OmegaNum): OmegaNum {
            return new OmegaNum(1.02).pow(count);
        },

        priceScaling: () => new Exp2Scaling(10, Math.sqrt(10), 10, 10),
    },
];

const challengeSpecs: AChallengeSpec[] = [
    {
        id: 1,
        name: 'AC1',
        descriptionId: 'AC1.description',
        effectDescriptionId: 'AC1.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum('1e340'),
    },
    {
        id: 2,
        name: 'AC2',
        descriptionId: 'AC2.description',
        effectDescriptionId: 'AC2.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum('1e450'),
    },
    {
        id: 3,
        name: 'AC3',
        descriptionId: 'AC3.description',
        effectDescriptionId: 'AC3.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum('1e1000'),
    },
    {
        id: 4,
        name: 'AC4',
        descriptionId: 'AC4.description',
        effectDescriptionId: 'AC4.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum(Number.MAX_VALUE),
    },
    {
        id: 5,
        name: 'AC5',
        descriptionId: 'AC5.description',
        effectDescriptionId: 'AC5.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum(Number.MAX_VALUE),
    },
    {
        id: 6,
        name: 'AC6',
        descriptionId: 'AC6.description',
        effectDescriptionId: 'AC6.effect',

        unlocked() {
            return A.U(22).bought;
        },

        runningNerfOnEnable: {},

        targetPoint: new OmegaNum('e360'),
    },
];

const upgrades: Record<number, AUpgrade> = idMapping(upgradeSpecs, AUpgrade);
const buyables: Record<number, ABuyable> = idMapping(buyableSpecs, ABuyable);
const challenges: Record<number, AChallenge> = idMapping(challengeSpecs, AChallenge);

const A = {
    get points(): OmegaNum {
        return player.A.points;
    },
    set points(value: OmegaNum) {
        player.A.points = value;
    },

    get resetTimes(): OmegaNum {
        return player.A.resetTimes;
    },
    set resetTimes(value: OmegaNum) {
        player.A.resetTimes = value;
    },

    pointsOnReset(): OmegaNum {
        let recordPointPoints = player.records.current.A?.point?.points ?? new OmegaNum(1);
        let gain = new OmegaNum(10).pow(recordPointPoints.max(1).log10().sub(80).div(308));
        gain = gain.mul(Effects.prod(
            A.B(1),
        ));
        return gain;
    },
    timesOnReset(): OmegaNum {
        return new OmegaNum(1);
    },

    upgrades: Object.values(upgrades),
    U(id: number): AUpgrade {
        return upgrades[id] ?? error('id not exist');
    },

    buyables: Object.values(buyables),
    B(id: number): ABuyable {
        return buyables[id] ?? error('id not exist');
    },

    updateRecordLayer(data: PartialRecordsData) {
        if (data.A === undefined) data.A = {};
        if (data.A.points === undefined) data.A.points = new OmegaNum(0);
        data.A.points = data.A.points.max(A.points);
        if (data.A.resetTimes === undefined) data.A.resetTimes = new OmegaNum(0);
        data.A.resetTimes = data.A.resetTimes.max(A.resetTimes);
    },

    updateRecords() {
        this.updateRecordLayer(player.records.historical);
        let level: keyof RecordsData;
        for (level in player.records.current) {
            if (level !== 'point' && level !== 'A') {
                this.updateRecordLayer(player.records.current[level]);
            }
        }
    },

    updateRecordLayerOnReset(data: PartialRecordsData) {
        if (data.A === undefined) data.A = {};
        if (data.A.pointsOnReset === undefined) data.A.pointsOnReset = new OmegaNum(0);
        data.A.pointsOnReset = data.A.pointsOnReset.max(A.pointsOnReset());
        if (data.A.resetDuration === undefined) data.A.resetDuration = new OmegaNum(Infinity);
        data.A.resetDuration = data.A.resetDuration.min(
            player.records.current.A.point?.gameTime ?? Infinity);
    },

    updateRecordsOnReset() {
        this.updateRecordLayerOnReset(player.records.historical);
        let level: keyof RecordsData;
        for (level in player.records.current) {
            if (level !== 'point' && level !== 'A') {
                this.updateRecordLayerOnReset(player.records.current[level]);
            }
        }
    },

    resetImpl() {
        player.point.points = new OmegaNum(1);
        player.point.boosters = [];
        player.point.upgrades = [];
        player.point.buyables = [];

        player.records.current.A = {};
    },

    reset: {
        type: 'reset',
        id: 0,
        name: '',
        owner: 'A',
        extraClasses: 'A-button',
        descriptionId: 'A.reset.description',
        hiddenDescriptionId: 'A.reset.hidden-description',
        dynamicDescriptionId(): TextId {
            if (A.C.running() === undefined) {
                if (!A.reset.buyable()) {
                    return 'A.reset.description-not-unlocked';
                } else {
                    return 'A.reset.description';
                }
            } else {
                if (!A.reset.buyable()) {
                    return 'A.reset.challenge.not-unlocked';
                } else {
                    return 'A.reset.challenge.can-complete';
                }
            }
        },
        args: {
            points: (): OmegaNum => A.pointsOnReset(),
            times: (): OmegaNum => A.timesOnReset(),
            target: (): OmegaNum => A.C.running()!!.targetPoint,
        },
        buyableImpl(): boolean {
            return Point.points.gte('1e80');
        },
        buyable(): boolean {
            let challenge = A.C.running();
            if (challenge !== undefined) return challenge.canComplete();
            return A.reset.buyableImpl();
        },
        buy(): void {
            if (!this.buyable()) return;

            let challenge = A.C.running();
            let canGain = A.reset.buyableImpl();

            let pointsGain = A.pointsOnReset();
            let timesGain = A.timesOnReset();

            if (canGain) A.updateRecordsOnReset();

            A.resetImpl();

            if (canGain) {
                A.points = A.points.add(pointsGain);
                A.resetTimes = A.resetTimes.add(timesGain);

                A.updateRecords();
            }

            if (challenge !== undefined) {
                challenge.fullyCompleted = true;
                player.A.runningChallenge = undefined;
            }
        },
        forceBuy(): void {
            if (this.buyable()) {
                this.buy();
            } else {
                A.resetImpl();
            }
        },
    } satisfies Reset & Record<string, unknown>,

    resetHotkey: {
        id: 'A.reset',
        description: 'hotkey.A-reset',
        action() {
            A.reset.buy();
        },
    } satisfies HotkeyEvent,

    challenges: Object.values(challenges),
    C: _.merge(function challenge(id: number): AChallenge {
        return challenges[id] ?? error('id not exist');
    }, {
        running: (): AChallenge | undefined => {
            let id = player.A.runningChallenge;
            return id === undefined ? undefined : A.C(id);
        },

        completedAmount: (): number => {
            let result = 0;
            for (let c of A.challenges) {
                if (c.fullyCompleted) result++;
            }
            return result;
        },
    }),

    init() {
        let hotkeyReset = player.automation.A.hotkeyReset;
        if (hotkeyReset.key !== undefined) {
            registerHotkey(hotkeyReset.key, A.resetHotkey);
        }
    },

    gameLoop(duration: number): void {
        if (player.A.unlocked && toBoolean(Point.U(25).unlocked, true)) {
            Point.U(25).bought = true;
        }
        if (player.automation.point.hotkeyBuyable.unlocked) {
            A.U(15).bought = true;
        }
        if (A.U(14).bought) {
            for (let pu of Point.upgrades) {
                if (pu.buyable()) pu.bought = true;
            }
        }

        alertOnce(
            'reset-A-twice',
            () => A.U(11).bought && Point.points.gte('1e80'),
            text('hint.reset-A-twice'),
        );
    },
};

export default A;

(window as any).A = A;