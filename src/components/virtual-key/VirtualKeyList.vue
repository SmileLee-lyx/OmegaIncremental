<script lang="ts" setup>
import VirtualKey from "@/components/virtual-key/VirtualKey.vue";
import { computed } from "vue";

const props = defineProps<{
    show?: boolean;
    keys?: string[];
}>();

const showList = computed(() => props.show ?? false);
</script>

<template>
    <div v-if="showList" class="virtual-key-list">
        <VirtualKey keyName="shift"/>
        <VirtualKey keyName="ctrl"/>
        <template v-if="keys !== undefined">
            <VirtualKey v-for="k of keys"
                        :key="k"
                        :keyName="k"/>
        </template>
    </div>
</template>

<style scoped>
.virtual-key-list {
    display: block;
    position: fixed;
    right: 10px;
    bottom: 100px;
    z-index: 50;
}
</style>