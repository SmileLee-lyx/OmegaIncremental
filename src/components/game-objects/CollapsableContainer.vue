<script lang="ts" setup>
import { runOnFrame } from "@/components/misc/run-on-frame.js";
import { onMounted, ref, type Ref } from "vue";

const props = defineProps<{
    width: number;
    modelValue: boolean | undefined;
    extraClasses?: string | string[];
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
}>();

let target: Ref<HTMLDivElement | null> = ref(null);
let height: Ref<number> = ref(0);
let forceAutoHeight: Ref<boolean> = ref(false);
let inTransition: Ref<boolean> = ref(false);

function style(): any {
    onResize();
    return {
        height: forceAutoHeight.value ? 'auto' :
            props.modelValue ? '0' : height.value + 'px',
        width: props.width + 'px',
    };
}

function toggle() {
    emit('update:modelValue', !props.modelValue);
    inTransition.value = true;
    onResize();
}

function onResize() {
    if (target.value !== null) {
        height.value = target.value.scrollHeight;
    }
}

runOnFrame(() => {
    if (forceAutoHeight.value) {
        forceAutoHeight.value = false;
    }
    if (target.value !== null) {
        if (target.value.scrollHeight !== height.value) {
            height.value = target.value.scrollHeight;
            forceAutoHeight.value = true;
        }
    }
});

onMounted(() => {
    forceAutoHeight.value = true;
});

defineExpose({
    onResize,
});
</script>

<template>
    <div :class="extraClasses"
         :style="{ width: width + 'px' }"
         class="outer-collapsable-container">
        <div ref="target"
             :class="[extraClasses, { collapsed: props.modelValue || inTransition }]"
             :style="style()"
             class="collapsable-container"
             @transitioncancel="inTransition = false"
             @transitionend="inTransition = false">
            <slot/>
        </div>
        <button :class="[extraClasses, { collapsed: modelValue }]"
                class="collapsable-trigger-button"
                @click="toggle()"/>
    </div>
</template>

<style scoped>

</style>