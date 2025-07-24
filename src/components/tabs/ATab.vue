<script setup lang="ts">

import HotkeySetter from "@/components/game-objects/HotkeySetter.vue";
import ResetButton from "@/components/game-objects/ResetButton.vue";
import UpgradeButton from "@/components/game-objects/UpgradeButton.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import A from "@/core/game-items/A.js";
import { player } from "@/core/global-objects.js";
import { text } from "@/text/text.js";
</script>

<template>
    <div class="main-text">
        <TextFormatter :text="text('A.amount')" :args="{amount: () => A.points}"/>
        <br>
        <ResetButton :reset="A.reset" extra_classes="A-button"/>
        <br>
        <HotkeySetter :config="A.resetHotkey"
                      :data="player.automation.A.hotkeyReset"/>
        <br><br>

        <div class="fixed-width-panel" style="width: 800px">
            <template v-for="i in A.upgrades.length" :key="i">
                <UpgradeButton :upgrade="A.upgrades[i - 1]" extra_classes="A-button"/>
            </template>
        </div>

    </div>
</template>

<style scoped>

</style>