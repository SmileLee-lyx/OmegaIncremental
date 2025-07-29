<script lang="ts" setup>
import {
    handleKeyDown,
    handleKeyUp,
    isCtrlButtonPressed,
    isShiftButtonPressed,
} from "@/core/misc/global-keyboard-press.js";
import { runHotkeyAction } from "@/core/misc/hotkey.js";

const props = defineProps<{
    keyName: string;
}>();

function start() {
    if (props.keyName === 'shift') {
        isShiftButtonPressed.value = true;
    } else if (props.keyName === 'ctrl') {
        isCtrlButtonPressed.value = true;
    } else {
        runHotkeyAction(props.keyName);
        handleKeyDown(props.keyName);
    }
}

function end() {
    if (props.keyName === 'shift') {
        isShiftButtonPressed.value = false;
    } else if (props.keyName === 'ctrl') {
        isCtrlButtonPressed.value = false;
    } else {
        handleKeyUp(props.keyName);
    }
}
</script>

<template>
    <span class="virtual-key"
          @mousedown="(_) => start()" @mouseup="(_) => end()"
          @touchend="(_) => end()" @touchstart="(_) => start()">
        {{ keyName.toUpperCase() }}
    </span>
</template>

<style scoped>
.virtual-key {
    touch-action: none;
    user-select: none;

    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 160px;
    height: 160px;
    margin: 2px;
    border-radius: 50%;
    border: #000 2px solid;
    background-color: #fff;

}
</style>