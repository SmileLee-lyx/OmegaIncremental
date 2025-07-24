<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { Effects } from "@/core/Effects.js";
import { text } from "@/text/text.js";
import { type SideBarConfig } from "@/util/side-bar-config.js";
import { toBoolean } from "@/util/util.js";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import prod = Effects.prod;

const props = defineProps<{
    config: SideBarConfig;
    modelValue: string | null;
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: string | null): void;
}>();

const itemGroupMapping: ComputedRef<Record<string, string>> = computed(() => {
    const result: Record<string, string> = {};
    for (let group of props.config.groups) {
        for (let item of group.items) {
            result[item.id] = group.id;
        }
    }
    return result;
});

function itemGroup(itemId: string): string;
function itemGroup(itemId: null): null;
function itemGroup(itemId: string | null): string | null;

function itemGroup(itemId: string | null): string | null {
    return itemId !== null ? itemGroupMapping.value[itemId] : null;
}

const groupIndexMapping: ComputedRef<Record<string, number>> = computed(() => {
    const result: Record<string, number> = {};
    for (let i = 0; i < props.config.groups.length; ++i) {
        result[props.config.groups[i].id] = i;
    }
    return result;
});

function groupIndex(groupId: string): number {
    return groupIndexMapping.value[groupId];
}

const itemIndexMapping: ComputedRef<Record<string, number>> = computed(() => {
    const result: Record<string, number> = {};
    for (let group of props.config.groups) {
        for (let i = 0; i < group.items.length; ++i) {
            result[group.items[i].id] = i;
        }
    }
    return result;
});

function itemIndex(itemId: string): number {
    return itemIndexMapping.value[itemId];
}

const groupActiveItems: Record<string, string> = {};

function findNextActive(itemId: string | null, groupId: string | null, inclusive: boolean = true): string | null {
    if (groupId === null) groupId = itemGroup(itemId!!);
    const group = props.config.groups[groupIndex(groupId)];
    let startIndex = itemId == null ? 0 : itemIndex(itemId);
    if (!inclusive) startIndex = (startIndex + 1) % group.items.length;
    let index = startIndex;
    while (true) {
        let shown;
        if (toBoolean(group.items[index].shown)) return group.items[index].id;
        index = (index + 1) % group.items.length;
        if (index === startIndex) return null;
    }
}

function switchItem(itemId: string | null) {
    emit("update:modelValue", itemId);
    if (itemId !== null) groupActiveItems[itemGroup(itemId)] = itemId;
}

function switchGroup(groupId: string) {
    let currentItemId: string | null = props.modelValue;
    let currentGroupId: string | null = currentItemId !== null ? itemGroup(currentItemId) : null;
    if (currentGroupId !== groupId) {
        let targetItemId = groupActiveItems[groupId];
        if (targetItemId !== undefined) {
            switchItem(targetItemId);
        } else {
            switchItem(findNextActive(null, groupId));
        }
    } else {
        let targetItemId = groupActiveItems[groupId];
        if (targetItemId !== undefined) {
            switchItem(findNextActive(targetItemId, groupId, false));
        } else {
            switchItem(findNextActive(null, groupId));
        }
    }
}

function itemShown(itemId: string): boolean {
    let groupId = itemGroup(itemId);
    let group = props.config.groups[groupIndex(groupId)];
    let item = group.items[itemIndex(itemId)];
    return toBoolean(item.shown, true);
}

function groupShown(groupId: string): boolean {
    let group = props.config.groups[groupIndex(groupId)];
    return toBoolean(group.shown, true) &&
        group.items.some((item) => toBoolean(item.shown, true));
}

let hoveredGroup: Ref<string | null> = ref(null);
let hoveredTab: Ref<string | null> = ref(null);
let subMenuGroup: Ref<string | null> = ref(null);
let leaveTimeout: NodeJS.Timeout | undefined;

function mouseEnterGroup(groupId: string) {
    hoveredGroup.value = groupId;
    hoveredTab.value = null;
    subMenuGroup.value = groupId;
    clearTimeout(leaveTimeout);
    leaveTimeout = undefined;
}

function mouseEnterItem(itemId: string) {
    hoveredGroup.value = subMenuGroup.value = itemGroup(itemId);
    hoveredTab.value = itemId;
    clearTimeout(leaveTimeout);
    leaveTimeout = undefined;
}

function mouseLeaveGroup(groupId: string) {
    if (hoveredGroup.value === groupId && hoveredTab.value === null) {
        hoveredGroup.value = null;
        leaveTimeout = setTimeout(() => { subMenuGroup.value = null; }, 300);
    }
}

function mouseLeaveItem(itemId: string) {
    if (hoveredGroup.value === itemGroup(itemId) && hoveredTab.value === itemId) {
        hoveredGroup.value = null;
        hoveredTab.value = null;
        leaveTimeout = setTimeout(() => { subMenuGroup.value = null; }, 300);
    }
}
</script>

<template>
    <div class="sidebar">
        <div
            class="sidebar-header"
        >
            <span class="sidebar-header-text">
                <TextFormatter :text="text('sidebar.title')"></TextFormatter>
            </span>
        </div>
        <template v-for="group of config.groups">
            <div
                v-if="toBoolean(group.shown)"
                class="sidebar-element"
            >
                <button
                    class="sidebar-button"
                    @click="switchGroup(group.id)"
                    @mouseenter="mouseEnterGroup(group.id)"
                    @mouseleave="mouseLeaveGroup(group.id)"
                >
                <span class="sidebar-button-text">
                    <TextFormatter :text="text(group.description)"/>
                </span>
                    <span v-if="itemGroup(modelValue) === group.id" class="chosen-button-left"></span>
                </button>
                <!--            <div v-if="group.tabs.some((tab) => game.alert_tabs.has(tab.tabId))" class="sidebar-alert"/>-->
                <transition name="fade">
                    <div
                        v-if="subMenuGroup === group.id"
                        class="sidebar-sub-menu"
                    >
                        <template v-for="item of group.items">
                        <div v-if="toBoolean(item.shown, true)" class="sidebar-sub-menu-element">
                            <button
                                class="sidebar-sub-menu-button"
                                @click="switchItem(item.id)"
                                @mouseenter="mouseEnterItem(item.id)"
                                @mouseleave="mouseLeaveItem(item.id)"
                            >
                            <span class="sidebar-sub-menu-button-text">
                                <TextFormatter :text="text(item.description)"/>
                            </span>
                                <span v-if="modelValue === item.id" class="chosen-button-top"></span>
                            </button>
                            <!--                        <div v-if="game.alert_tabs.has(tab.tabId)" class="sidebar-alert"/>-->
                        </div>
                        </template>
                    </div>
                </transition>
            </div>
        </template>
    </div>
</template>

<style scoped>
</style>