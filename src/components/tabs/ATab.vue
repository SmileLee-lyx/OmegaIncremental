<script lang="ts" setup>

import BuyablePanel from "@/components/game-objects/BuyablePanel.vue";
import CollapsableContainer from "@/components/game-objects/CollapsableContainer.vue";
import HotkeySetter from "@/components/game-objects/HotkeySetter.vue";
import ResetButton from "@/components/game-objects/ResetButton.vue";
import UpgradeButton from "@/components/game-objects/UpgradeButton.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import A from "@/core/game-items/A.js";
import { player } from "@/core/global-objects.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
</script>

<template>
    <div class="main-text">
        <TextFormatter :args="{amount: () => A.points}" :text="text('A.amount')"/>
        <br>
        <ResetButton :reset="A.reset"/>
        <br>
        <HotkeySetter :config="A.resetHotkey"
                      :data="player.automation.A.hotkeyReset"/>
        <br><br>

        <CollapsableContainer
            v-model="player.game.collapsedPanels['A.upgrade']"
            :width="800"
            extraClasses="A-button">
            <template v-for="u of A.upgrades" :key="u.index">
                <UpgradeButton :upgrade="u"/>
            </template>
        </CollapsableContainer>

        <CollapsableContainer
            v-if="A.buyables.some((b) => toBoolean(b.visible, true))"
            v-model="player.game.collapsedPanels['A.buyable']"
            :width="800"
            extraClasses="A-button">
            <template v-for="b of A.buyables" :key="b.index">
                <BuyablePanel :buyable="b"/>
            </template>
        </CollapsableContainer>
    </div>
</template>

<style scoped>

</style>