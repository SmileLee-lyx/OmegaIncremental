<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import Point from "@/core/game-items/point.js";
import { text } from "@/text/text.js";
</script>

<template>
    <div class="header">
        <div class="main-text header-point-text">
            <TextFormatter :args="{amount: () => Point.points}"
                           :text="text('header.point')"/>
            <br>
            <TextFormatter :text="text('endgame-condition')"
                           class="small2"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header-point-text {
    font-size: 25px;
    margin-top: 15px;
}

.header-point-inc-text {
    font-size: 15px;
}
</style>