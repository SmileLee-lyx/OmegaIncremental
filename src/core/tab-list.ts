import ATab from "@/components/tabs/ATab.vue";
import PointTab from "@/components/tabs/PointTab.vue";
import SettingsTab from "@/components/tabs/SettingsTab.vue";
import StatsRecordsTab from "@/components/tabs/StatsTab.vue";
import { player } from "@/core/global-objects.js";
import type { SideBarConfig } from "@/util/side-bar-config.js";
import type { Component } from "vue";

export const tabs: Record<string, Component> = {
    'Point': PointTab,
    'A': ATab,
    'StatsRecords': StatsRecordsTab,
    'Settings': SettingsTab,
};

export const sideBarConfig: SideBarConfig = {
    groups: [
        {
            id: 'Point',
            description: 'tab-group.Point',
            items: [
                {
                    id: 'Point',
                    description: 'tab.Point',
                },
            ],
        },
        {
            id: 'A',
            description: 'tab-group.A',
            shown() {
                return player.A.unlocked;
            },
            items: [
                {
                    id: 'A',
                    description: 'tab.A',
                },
            ],
        },
        {
            id: 'Stats',
            description: 'tab-group.Stats',
            items: [
                {
                    id: 'StatsRecords',
                    description: 'tab.StatsRecords',
                },
            ],
        },
        {
            id: 'Settings',
            description: 'tab-group.Settings',
            items: [
                {
                    id: 'Settings',
                    description: 'tab.Settings',
                },
            ],
        },
    ],
};