<script lang="ts" setup>

import ChallengePanel from "@/components/game-objects/ChallengePanel.vue";
import CollapsableContainer from "@/components/game-objects/CollapsableContainer.vue";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import A from "@/core/game-items/A.js";
import { alertOnceText } from "@/core/global-messages.js";
import { player } from "@/core/global-objects.js";
import { text } from "@/text/text.js";
import { type PFormattedText, resolveFormattedText } from "@/util/format.js";
import { onMounted } from "vue";

function runningChallenge(): PFormattedText {
    let running = A.C.running();
    if (running === undefined) return text('A.challenge.no-running');
    return resolveFormattedText(text('A.challenge.running'), {
        running: running.name,
    });
}

onMounted(() => {
    alertOnceText('hint.challenge-qol-effect', true);
});
</script>

<template>
    <div class="main-text">
        <TextFormatter :text="text('A.challenge.instruction')"
                       class="small"/>
        <br>
        <TextFormatter :text="runningChallenge()"
                       class="large2"/>
        <br>

        <CollapsableContainer v-model="player.game.collapsedPanels['A.challenge']"
                              :width="800"
                              extraClasses="A-button">
            <template v-for="i in A.challenges.length" :key="i">
                <ChallengePanel :challenge="A.challenges[i-1]"
                                extra_classes="A-button"/>
            </template>
        </CollapsableContainer>
    </div>
</template>

<style scoped>

</style>