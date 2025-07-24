import type { TextId } from "@/text/text.js";
import type { BooleanSource } from "@/util/util.js";

export interface SideBarItem {
    id: string;
    description: TextId;
    shown?: BooleanSource;
}

export interface SideBarGroup {
    id: string;
    description: TextId;
    items: SideBarItem[];
    shown?: BooleanSource;
}

export interface SideBarConfig {
    groups: SideBarGroup[];
}