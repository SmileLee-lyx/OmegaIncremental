import A from "@/core/game-items/A.js";
import Point from "@/core/game-items/point.js";
import { GlobalMessages } from "@/core/global-messages.js";
import { player } from "@/core/global-objects.js";
import { AbstractAchievement } from "@/core/Types.js";
import { text, type TextId } from "@/text/text.js";
import { getBit, setBit } from "@/util/bit-array.js";
import { resolveFormattedText } from "@/util/format.js";
import { error, idMapping } from "@/util/util.js";
import _ from "lodash";
import { computed } from "vue";

interface AchievementImplSpec {
    id: number;
    name: string;
    descriptionId: TextId;

    buyCondition: () => boolean;

    extraClasses?: string | string[];
}

class AchievementImpl extends AbstractAchievement {
    index: number;
    extraClasses?: string | string[];

    constructor(spec: AchievementImplSpec, index: number) {
        super({
            owner: '',
            ...spec,
        });
        this.index = index;
        this.extraClasses = spec.extraClasses;
    }

    get bought(): boolean {
        return getBit(player.achievements, this.index);
    }

    set bought(value: boolean) {
        setBit(player.achievements, this.index, value);
    }

    buy() {
        this.bought = true;
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('achievement.new'), { name: this.name }),
        );
    }
}

const achievementSpecs: AchievementImplSpec[] = [
    {
        id: 11,
        name: 'Ach11',
        descriptionId: 'Ach11.description',

        buyCondition(): boolean {
            return Point.U(11).bought;
        },
    },
    {
        id: 12,
        name: 'Ach12',
        descriptionId: 'Ach12.description',

        buyCondition(): boolean {
            return Point.points.gte(100);
        },
    },
    {
        id: 13,
        name: 'Ach13',
        descriptionId: 'Ach13.description',

        buyCondition(): boolean {
            return Point.points.gte('1e10');
        },
    },
    {
        id: 14,
        name: 'Ach14',
        descriptionId: 'Ach14.description',

        buyCondition(): boolean {
            return Point.points.gte('1e50');
        },
    },
    {
        id: 15,
        name: 'Ach15',
        descriptionId: 'Ach15.description',

        buyCondition(): boolean {
            return Point.points.gte('1e80');
        },
    },
    {
        id: 16,
        name: 'Ach16',
        descriptionId: 'Ach16.description',

        buyCondition(): boolean {
            return Point.points.gte('1e100');
        },
    },
    {
        id: 17,
        name: 'Ach17',
        descriptionId: 'Ach17.description',

        buyCondition(): boolean {
            return Point.points.gte('1e160');
        },
    },
    {
        id: 18,
        name: 'Ach18',
        descriptionId: 'Ach18.description',

        buyCondition(): boolean {
            return Point.points.gte(Number.MAX_VALUE);
        },
    },
    {
        id: 21,
        name: 'Ach21',
        descriptionId: 'Ach21.description',

        buyCondition(): boolean {
            return Point.U(15).bought;
        },
    },
    {
        id: 22,
        name: 'Ach22',
        descriptionId: 'Ach22.description',

        buyCondition(): boolean {
            return Point.U(22).bought;
        },
    },
    {
        id: 23,
        name: 'Ach23',
        descriptionId: 'Ach23.description',

        buyCondition(): boolean {
            return Point.U(23).bought;
        },
    },
    {
        id: 24,
        name: 'Ach24',
        descriptionId: 'Ach24.description',

        buyCondition(): boolean {
            return Point.booster(1).amount.gte('1e50');
        },
    },
    {
        id: 25,
        name: 'Ach25',
        descriptionId: 'Ach25.description',

        buyCondition(): boolean {
            return Point.booster(2).amount.gte('1e100');
        },
    },
    {
        id: 26,
        name: 'Ach26',
        descriptionId: 'Ach26.description',

        buyCondition(): boolean {
            return Point.U(31).bought;
        },
    },
    {
        id: 27,
        name: 'Ach27',
        descriptionId: 'Ach27.description',

        buyCondition(): boolean {
            return Point.U(32).bought;
        },
    },
    {
        id: 28,
        name: 'Ach28',
        descriptionId: 'Ach28.description',

        buyCondition(): boolean {
            return Point.booster(5).amount.gte('1e25');
        },
    },
    {
        id: 31,
        name: 'Ach31',
        descriptionId: 'Ach31.description',

        buyCondition(): boolean {
            return A.points.gte(1); // TODO: 使得判定更加符合描述
        },

        extraClasses: 'A-button',
    },
    {
        id: 32,
        name: 'Ach32',
        descriptionId: 'Ach32.description',

        buyCondition(): boolean {
            return A.points.gte(1000);
        },

        extraClasses: 'A-button',
    },
    {
        id: 33,
        name: 'Ach33',
        descriptionId: 'Ach33.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 1;
        },

        extraClasses: 'A-button',
    },
    {
        id: 34,
        name: 'Ach34',
        descriptionId: 'Ach34.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 2;
        },

        extraClasses: 'A-button',
    },
    {
        id: 35,
        name: 'Ach35',
        descriptionId: 'Ach35.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 3;
        },

        extraClasses: 'A-button',
    },
    {
        id: 36,
        name: 'Ach36',
        descriptionId: 'Ach36.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 4;
        },

        extraClasses: 'A-button',
    },
    {
        id: 37,
        name: 'Ach37',
        descriptionId: 'Ach37.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 5;
        },

        extraClasses: 'A-button',
    },
    {
        id: 38,
        name: 'Ach38',
        descriptionId: 'Ach38.description',

        buyCondition(): boolean {
            return A.C.completedAmount() >= 6;
        },

        extraClasses: 'A-button',
    },
    {
        id: 41,
        name: 'Ach41',
        descriptionId: 'Ach41.description',

        buyCondition(): boolean {
            return Point.points.gte('1e350');
        },
    },
    {
        id: 42,
        name: 'Ach42',
        descriptionId: 'Ach42.description',

        buyCondition(): boolean {
            return player.records.historical.A.pointsOnReset.gte(10);
            // TODO: 使得判定更加符合描述
        },

        extraClasses: 'A-button',
    },
    {
        id: 43,
        name: 'Ach43',
        descriptionId: 'Ach43.description',

        buyCondition(): boolean {
            return Point.points.gte('1e450');
        },
    },
    {
        id: 44,
        name: 'Ach44',
        descriptionId: 'Ach44.description',

        buyCondition(): boolean {
            return player.records.historical.A.pointsOnReset.gte(100);
            // TODO: 使得判定更加符合描述
        },

        extraClasses: 'A-button',
    },
    {
        id: 45,
        name: 'Ach45',
        descriptionId: 'Ach45.description',

        buyCondition(): boolean {
            return Point.points.gte('1e600');
        },
    },
    {
        id: 46,
        name: 'Ach46',
        descriptionId: 'Ach46.description',

        buyCondition(): boolean {
            return player.records.historical.A.pointsOnReset.gte(1000);
            // TODO: 使得判定更加符合描述
        },

        extraClasses: 'A-button',
    },
    {
        id: 47,
        name: 'Ach47',
        descriptionId: 'Ach47.description',

        buyCondition(): boolean {
            return Point.points.gte('1e1000');
        },
    },
    {
        id: 48,
        name: 'Ach48',
        descriptionId: 'Ach48.description',

        buyCondition(): boolean {
            return player.records.historical.A.pointsOnReset.gte(1e5);
            // TODO: 使得判定更加符合描述
        },

        extraClasses: 'A-button',
    },
];

export const achievements: Record<number, AchievementImpl> = idMapping(achievementSpecs, AchievementImpl);

let Ach = _.merge(function Ach(id: number): AchievementImpl {
    return achievements[id] ?? error('id not exist');
}, {
    achievements: Object.values(achievements),

    amount: computed(() => {
        let result: number = 0;
        for (let ach of Ach.achievements) {
            if (ach.bought) result++;
        }
        return result;
    }),

    gameLoop() {
        for (let ach of Ach.achievements) {
            if (!ach.bought) {
                if (ach.buyCondition()) {
                    ach.buy();
                }
            }
        }
    },
});

export default Ach;

