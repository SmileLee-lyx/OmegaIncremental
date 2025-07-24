<script lang="ts" setup>
import BuyablePanel from "@/components/game-objects/BuyablePanel.vue";
import HotkeySetter from "@/components/game-objects/HotkeySetter.vue";
import UpgradeButton from "@/components/game-objects/UpgradeButton.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import Point from "@/core/game-items/point.js";
import { player } from "@/core/global-objects.js";
import { text } from "@/text/text.js";
</script>

<template>
    <div class="main-text">
        <div class="fixed-width-panel" style="width: 800px">
            <template v-for="i in Point.upgrades.length" :key="i">
                <UpgradeButton :upgrade="Point.upgrades[i - 1]"/>
            </template>
        </div>
        <div class="horizontal-flex-panel">
            <template v-for="i in 5" :key="i">
                <span v-if="Point.booster(i).unlocked()"
                      style="display: inline-block">
                    <TextFormatter :args="{level: () => i, amount: () => Point.booster(i).amount}"
                                   :text="text('Point.booster-amount-description')"/>
                </span>
            </template>
        </div>
        <div class="fixed-width-panel" style="width: 800px">
            <template v-for="i in Point.buyables.length" :key="i">
                <BuyablePanel :buyable="Point.buyables[i - 1]"/>
            </template>
        </div>
        <br>
        <HotkeySetter :config="Point.buyableHotkey"
                      :data="player.automation.point.hotkeyBuyable"/>
    </div>
</template>

<style scoped>

</style>