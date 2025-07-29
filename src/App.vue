<script lang="ts" setup>
import MessageManager from "@/components/message/MessageManager.vue";
import SideBar from "@/components/sidebar/SideBar.vue";
import Header from "@/components/tabs/Header.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import VirtualKeyList from "@/components/virtual-key/VirtualKeyList.vue";
import { gameLoop, initGame } from "@/core/game-loop.js";
import { GlobalMessages } from "@/core/global-messages.js";
import { lastAutoSave, player } from "@/core/global-objects.js";
import { initGlobal } from "@/core/init.js";
import { globalNow } from "@/core/misc/component-timer.ts";
import { runOnFrame } from "@/core/misc/run-on-frame.ts";
import { sideBarConfig, tabs } from "@/core/tab-list.js";
import { formatTime, text } from "@/text/text.js";

import { type FormattedText, resolveFormattedText } from "@/util/format.js";
import { type Component, computed, type ComputedRef } from "vue";

import "@/assets/main.scss";

initGlobal();
initGame();

let autoSaveTimeText: ComputedRef<FormattedText> = computed(() => {
    if (lastAutoSave.value === null) {
        return resolveFormattedText(text('autosave.never'));
    }
    let time = (globalNow.value - lastAutoSave.value) / 1000;
    return resolveFormattedText(text('autosave.time'), {
        time: formatTime(time),
    });
});

let previousTimeMs = performance.now();

runOnFrame(() => {
    let currentTimeMs = performance.now();
    let duration = (currentTimeMs - previousTimeMs) / 1000;
    previousTimeMs = currentTimeMs;
    gameLoop(duration);
});

let activeTab: ComputedRef<Component | null> = computed(() => {
    return player.game.activeTab !== null ? tabs[player.game.activeTab] : null;
});

</script>

<template>
    <SideBar v-model="player.game.activeTab" :config="sideBarConfig"/>
    <div class="content">
        <div class="tab-container">
            <Header/>
            <div class="tab-content">
                <Component :is="activeTab"/>
            </div>
        </div>
    </div>
    <div class="auto-save-time">
        <TextFormatter :text="autoSaveTimeText"/>
    </div>
    <MessageManager :manager="GlobalMessages"/>

    <div class="auto-save-time">
        <TextFormatter :text="autoSaveTimeText"/>
    </div>

    <VirtualKeyList :show="player.settings.showVirtualKey" :keys="player.settings.virtualKeys"/>
</template>

<style scoped>
.auto-save-time {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10000;
    font-size: 12px;
    border: black solid 1px;
    background: white;
}
</style>
