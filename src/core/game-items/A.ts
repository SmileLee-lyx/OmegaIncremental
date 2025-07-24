import { registerHotkey } from "@/components/misc/global-keyboard-press.js";
import Point from "@/core/game-items/point.js";
import { GlobalMessages } from "@/core/global-messages.js";
import { type PartialRecordsData, player, type RecordsData } from "@/core/global-objects.js";
import { AbstractUpgrade, type HotkeyEvent, type Reset } from "@/core/Types.js";
import { text, type TextId } from "@/text/text.js";
import { getBit, setBit } from "@/util/bit-array.js";
import { type FormattedText, resolveFormattedText } from "@/util/format.js";
import { toBoolean } from "@/util/util.js";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

interface AUpgradeSpec {
    id: number;
    name: string;
    descriptionId: TextId;
    hiddenDescriptionId?: TextId;
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
                    messageText: resolveFormattedText(text('hint.mouse-trigger-hotkey'))
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
];

const upgrades: Record<number, AUpgrade> = [];

for (let i = 0; i < upgradeSpecs.length; i++) {
    upgrades[upgradeSpecs[i].id] = new AUpgrade(upgradeSpecs[i], i);
}

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
        return new OmegaNum(10).pow(recordPointPoints.max(1).log10().sub(80).div(308));
    },
    timesOnReset(): OmegaNum {
        return new OmegaNum(1);
    },

    upgrades: Object.values(upgrades),
    U(id: number): AUpgrade {
        return upgrades[id];
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
        descriptionId: 'A.reset.description',
        hiddenDescriptionId: 'A.reset.hidden-description',
        dynamicDescriptionId(): TextId {
            if (A.reset.buyable()) return 'A.reset.description';
            return 'A.reset.description-not-unlocked';
        },
        args: {
            points: (): OmegaNum => A.pointsOnReset(),
            times: (): OmegaNum => A.timesOnReset(),
        },
        buyable(): boolean {
            return Point.points.gte('1e80');
        },
        buy(): void {
            let pointsGain = A.pointsOnReset();
            let timesGain = A.timesOnReset();

            A.resetImpl();

            A.points = A.points.add(pointsGain);
            A.resetTimes = A.resetTimes.add(timesGain);

            A.updateRecords();
        },
    } satisfies Reset,

    resetHotkey: {
        id: 'A.reset',
        description: 'hotkey.A-reset',
        action() {
            A.reset.buy()
        }
    } satisfies HotkeyEvent,

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
        if (A.U(21).bought) {
            for (let pu of Point.upgrades) {
                if (pu.buyable()) pu.bought = true;
            }
        }
        if (!player.game.shownAlerts.includes('reset-A-twice')) {
            if (A.U(11).bought && A.U(12).bought && Point.points.gte('1e80')) {
                GlobalMessages.addMessage({
                    type: 'alert',
                    messageText: resolveFormattedText(
                        text('hint.reset-A-twice')
                    )
                });
                player.game.shownAlerts.push('reset-A-twice');
            }
        }
    },
};

export default A;

(window as any).A = A;