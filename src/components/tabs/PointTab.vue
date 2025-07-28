<script lang="ts" setup>
import BuyablePanel from "@/components/game-objects/BuyablePanel.vue";
import CollapsableContainer from "@/components/game-objects/CollapsableContainer.vue";
import HotkeySetter from "@/components/game-objects/HotkeySetter.vue";
import UpgradeButton from "@/components/game-objects/UpgradeButton.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import Point from "@/core/game-items/point.js";
import { player } from "@/core/global-objects.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
</script>

<template>
    <div class="main-text">
        <CollapsableContainer
            v-model="player.game.collapsedPanels['Point.upgrade']"
            :width="800">
            <template v-for="i in Point.upgrades.length" :key="i">
                <UpgradeButton :upgrade="Point.upgrades[i - 1]"/>
            </template>
        </CollapsableContainer>
        <div class="horizontal-flex-panel">
            <template v-for="i in 5" :key="i">
                <span v-if="Point.booster(i).unlocked()"
                      style="display: inline-block">
                    <TextFormatter :args="{level: () => i, amount: () => Point.booster(i).amount}"
                                   :text="text('Point.booster-amount-description')"/>
                </span>
            </template>
        </div>
        <CollapsableContainer
            v-if="Point.buyables.some((b) => toBoolean(b.visible, true))"
            v-model="player.game.collapsedPanels['Point.buyable']"
            :width="800">
            <template v-for="i in Point.buyables.length" :key="i">
                <BuyablePanel :buyable="Point.buyables[i - 1]"/>
            </template>
        </CollapsableContainer>
        <br>
        <HotkeySetter :config="Point.buyableHotkey"
                      :data="player.automation.point.hotkeyBuyable"/>
    </div>
</template>

<style scoped>

</style>