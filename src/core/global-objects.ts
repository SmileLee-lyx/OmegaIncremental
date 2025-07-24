import _ from "lodash";
import OmegaNum from "omega_num.js";
import { reactive, ref, type Ref } from "vue";

export type RecordsData = {
    point: {
        gameTime: OmegaNum;
        realTime: number;
        points: OmegaNum;
    };
    A: {
        points: OmegaNum;
        resetTimes: OmegaNum;
    };
}

export type PartialRecordsData = {
    [targetLevel in keyof RecordsData]?: Partial<RecordsData[targetLevel]>;
}

export interface HotkeyData {
    unlocked: boolean;
    key?: string;
}

export interface AutomationData {
    unlocked: boolean;
    enabled: boolean;
}

export const VERSION: number = 0;

export interface Player {
    META: {
        timeStamp: number;
        saveVersion: number;
    };

    automation: {
        point: {
            hotkeyBuyable: HotkeyData;
        };
        A: {
            hotkeyReset: HotkeyData;
        }
    };

    point: {
        points: OmegaNum;
        boosters: OmegaNum[];
        upgrades: number[];
        buyables: OmegaNum[];
    };

    A: {
        unlocked: boolean;
        points: OmegaNum;
        resetTimes: OmegaNum;
        upgrades: number[];
        buyables: OmegaNum[];
    };

    records: {
        current: {
            [observationLevel in keyof RecordsData]: PartialRecordsData;
        };
        historical: RecordsData;
    };

    settings: {
        timeMode?: 'normal' | 'seconds';
        autoSaveMode?: 'every30Seconds' | 'every5Min' | 'never';
    };

    game: {
        activeTab: string | null;
        shownAlerts: string[];
    };
}

export const playerInitial: Player = {
    META: {
        timeStamp: 0,
        saveVersion: VERSION,
    },

    automation: {
        point: {
            hotkeyBuyable: {
                unlocked: false,
            },
        },
        A: {
            hotkeyReset: {
                unlocked: true,
            },
        },
    },

    point: {
        points: new OmegaNum(1),
        boosters: [],
        upgrades: [],
        buyables: [],
    },

    A: {
        unlocked: false,
        points: new OmegaNum(0),
        resetTimes: new OmegaNum(0),
        upgrades: [],
        buyables: [],
    },

    records: {
        historical: {
            point: {
                gameTime: new OmegaNum(0),
                realTime: 0,
                points: new OmegaNum(1),
            },
            A: {
                points: new OmegaNum(0),
                resetTimes: new OmegaNum(0),
            },
        },
        current: {
            point: {},
            A: {},
        },
    },

    settings: {},
    game: {
        activeTab: 'Point',

        shownAlerts: [],
    },
};

export let player: Player = reactive(_.cloneDeep(playerInitial));

export let lastAutoSave: Ref<number | null> = ref(null);