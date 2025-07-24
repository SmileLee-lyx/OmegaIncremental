<script lang="ts" setup>
import AlertBox from "@/components/message/AlertBox.vue";
import ConfirmBox from "@/components/message/ConfirmBox.vue";
import HeaderBox from "@/components/message/HeaderBox.vue";
import InputBox from "@/components/message/InputBox.vue";
import { runOnFrame } from "@/components/misc/run-on-frame.js";
import type { AlertData, ConfirmData, InputData, MessageManager } from "@/util/message-manager.js";
import { computed, type ComputedRef } from "vue";

const props = defineProps<{
    manager: MessageManager;
}>();

runOnFrame(() => props.manager.removeHeaderMessageOnTimeout());

function alertDone(index: number) {
    const message = props.manager.messages[index] as AlertData;
    if (message.done !== undefined) {
        message.done();
    }
    props.manager.activeIndices.delete(index);
}

function confirmDone(index: number) {
    const message = props.manager.messages[index] as ConfirmData;
    const keep = message.done();
    if (keep === undefined || !keep) {
        props.manager.activeIndices.delete(index);
    }
}

function confirmClose(index: number) {
    const message = props.manager.messages[index] as ConfirmData;
    if (message.cancel !== undefined) {
        message.cancel();
    }
    props.manager.activeIndices.delete(index);
}

function inputDone(index: number, text: string) {
    const message = props.manager.messages[index] as InputData;
    const keep = message.done(text);
    if (keep === undefined || !keep) {
        props.manager.activeIndices.delete(index);
    }
}

function input_close(index: number) {
    const message = props.manager.messages[index] as InputData;
    if (message.cancel !== undefined) {
        message.cancel();
    }
    props.manager.activeIndices.delete(index);
}

let sortedIndex: ComputedRef<Record<number, number>> = computed(() => {
    let result: number[] = [];
    let indices = Array.from(props.manager.activeIndices);
    indices.sort((a, b) => a - b);
    for (let i = 0; i < indices.length; ++i) {
        result[indices[i]] = i;
    }
    return result;
});

</script>

<template>
    <template v-for="index in manager.activeIndices"
              :key="sortedIndex[index]">
        <AlertBox
            v-if="manager.messages[index].type === 'alert'" :data="manager.messages[index] as AlertData" :index="index"
            @done="() => alertDone(index)"
        />
        <ConfirmBox
            v-if="manager.messages[index].type === 'confirm'" :data="manager.messages[index] as ConfirmData"
            :index="sortedIndex[index]"
            @close="() => confirmClose(index)" @done="() => confirmDone(index)"
        />
        <InputBox
            v-if="manager.messages[index].type === 'input_box'" :data="manager.messages[index] as InputData"
            :index="sortedIndex[index]"
            @close="() => input_close(index)" @done="(text) => inputDone(index, text)"
        />
    </template>
    <div v-if="manager.activeIndices.size > 0" :style="{zIndex: manager.activeIndices.size * 2 + 99}" class="modal"/>
    <transition-group name="message-header-slide">
        <HeaderBox v-for="header in manager.headers" :key="header.startTime" :data="header.messageText"/>
    </transition-group>
</template>

<style scoped>

</style>