<script setup lang="ts">

import Achievement from "@/components/game-objects/Achievement.vue";
import Ach from "@/core/game-items/achievement.js";
</script>

<template>
    <div class="main-text">
        <div class="fixed-width-panel" style="width: 680px">
            <template v-for="ach of Ach.achievements" :key="ach.index">
                <Achievement :achievement="ach"/>
            </template>
        </div>
    </div>
</template>

<style scoped>

</style>