<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { player } from "@/core/global-objects.js";
import { text, type TextId } from "@/text/text.js";

const hints: TextId[] = [
    'hint.mobile',
    'hint.manual-save',
    'hint.hold-shift',
    'hint.point-buyable-scaling',
    'hint.reset-A-twice',
    'hint.challenge-qol-effect',
];
</script>

<template>
    <div class="main-text">
        <TextFormatter :text="text('hint-tab.instruction')"/>
        <div class="hint-item">
            <TextFormatter :text="text('hint.info')"/>
        </div>
        <template v-for="h of hints">
            <template v-if="player.game.shownAlerts.includes(h)">
                <div class="hint-item">
                    <TextFormatter :text="text(h)"/>
                </div>
            </template>
        </template>
    </div>
</template>

<style scoped>
.hint-item {
    display: inline-block;
    width: 800px;
    border: none;
    background-color: #ccc;
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
}
</style>