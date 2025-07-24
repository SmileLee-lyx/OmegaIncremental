<script lang="ts" setup>

import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { type PartialRecordsData, player, type RecordsData } from "@/core/global-objects.js";
import { formatTime, text } from "@/text/text.js";
import { type PFormattedText } from "@/util/format.js";
import { toBoolean } from "@/util/util.js";
import OmegaNum from "omega_num.js";

type StatsLevelConfig = {
    level?: keyof RecordsData
    visible?: boolean | (() => boolean);
    description: PFormattedText;
};

type StatsEntryConfig = {
    key: { [K in keyof RecordsData]: { level: K; target: keyof RecordsData[K] } }[keyof RecordsData];
    description: PFormattedText;
    visible?: boolean | (() => boolean);
    value?: (level: StatsLevelConfig) => PFormattedText;
}

type StatsConfig = {
    levels: StatsLevelConfig[];
    entries: StatsEntryConfig[];
}

const config: StatsConfig = {
    levels: [
        {
            description: text('stats.historical'),
        },
        {
            level: 'A',
            description: text('stats.A'),
            visible() {
                return player.A.unlocked;
            },
        },
    ],
    entries: [
        {
            key: { level: 'point', target: 'gameTime' },
            description: text('stats.point.gameTime'),
            value(level) {
                let time = getEntry(level, this)!!;
                return formatTime(time);
            },
        },
        {
            key: { level: 'point', target: 'points' },
            description: text('stats.point.points'),
        },
        {
            key: { level: 'A', target: 'points' },
            description: text('stats.A.points'),
            visible() {
                return player.A.unlocked;
            },
        },
        {
            key: { level: 'A', target: 'resetTimes' },
            description: text('stats.A.resetTimes'),
            visible() {
                return player.A.unlocked;
            },
        },
    ],
};

function getData(level: StatsLevelConfig): PartialRecordsData {
    return level.level === undefined ?
        player.records.historical : player.records.current[level.level];
}

function getEntry(level: StatsLevelConfig, entry: StatsEntryConfig): OmegaNum | number | undefined {
    let data = getData(level) as any;
    return data[entry.key.level] === undefined ? undefined : data[entry.key.level][entry.key.target];
}

</script>

<template>
    <div class="main-text">
        <template v-for="level of config.levels">
            <template v-if="toBoolean(level.visible, true)">
                <div>
                    <TextFormatter :text="level.description" class="large2"/>
                </div>
                <template v-for="entry of config.entries">
                    <div v-if="toBoolean(entry.visible, true) && getEntry(level, entry) !== undefined">
                        <TextFormatter :args="{
                            [`${entry.key.level}.${entry.key.target}`]:
                                entry.value ? entry.value(level) : getEntry(level, entry)!! }"
                                       :text="entry.description"/>
                    </div>
                </template>
            </template>
        </template>
    </div>
</template>

<style scoped>

</style>