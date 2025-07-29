import { lastAutoSave, type Player, player, playerInitial } from "@/core/global-objects.js";
import { loadFromObject } from "@/core/save-load/migration.js";
import { deserialize, serialize } from "@/core/save-load/serialization.js";
import { error } from "@/util/util.js";
import _ from "lodash";
import { compress, compressToBase64, decompress, decompressFromBase64 } from "lz-string";
import { reactive } from "vue";

export function fullReset() {
    function move<K extends keyof Player>(key: K) {
        player[key] = _.cloneDeep(playerInitial[key]);
    }

    let key: keyof Player;
    for (key in playerInitial) {
        move(key);
    }
}

export function saveToString(base64: boolean = false): string {
    return (base64 ? compressToBase64 : compress)(serialize(player));
}

export function loadFromString(save: string, base64: boolean = false) {
    let data: any = deserialize((base64 ? decompressFromBase64 : decompress)(save));
    loadFromObject(data);
}

export const SLOT_LIST_NATIVE_NAME = 'slots';

export const saveSlots: Set<string> = reactive(new Set());

export function readSaveSlots() {
    saveSlots.clear();
    let saveSlotsText = localStorage.getItem(SLOT_LIST_NATIVE_NAME);
    if (saveSlotsText === null) return;
    let slotsArray: string[] = deserialize(saveSlotsText);
    slotsArray.forEach(slot => saveSlots.add(slot));
}

readSaveSlots();

export function writeSaveSlots() {
    localStorage.setItem(SLOT_LIST_NATIVE_NAME, serialize(Array.from(saveSlots)));
}

export function slotNativeName(slot: string): string {
    return 'save/' + slot;
}

export function deleteSlot(slot: string): void {
    localStorage.removeItem(slotNativeName(slot));
    saveSlots.delete(slot);
    writeSaveSlots();
}

export function slotExists(slot: string): boolean {
    return localStorage.getItem(slotNativeName(slot)) !== null;
}

export function writeSaveToSlot(slot: string) {
    localStorage.setItem(slotNativeName(slot), saveToString());
    saveSlots.add(slot);
    writeSaveSlots();
}

export function readSaveFromSlot(slot: string) {
    let str = localStorage.getItem(slotNativeName(slot));
    if (str === null) error('not save');
    loadFromString(str);
}

(window as any).saveToSlot = writeSaveToSlot;
(window as any).loadFromSlot = readSaveFromSlot;
(window as any).deleteSlot = deleteSlot;

export const AUTOSAVE_INDEX_NATIVE_NAME = 'autosave/index';

let autosaveIndex: number | null = null;

export const AUTOSAVE_INDEX_MAX = 5;

export function readAutosaveIndex() {
    let str = localStorage.getItem(AUTOSAVE_INDEX_NATIVE_NAME);
    if (str === null) return;
    autosaveIndex = Number(str);
}

readAutosaveIndex();

export function writeAutosaveIndex() {
    if (autosaveIndex === null) return;
    localStorage.setItem(AUTOSAVE_INDEX_NATIVE_NAME, autosaveIndex.toString());
}

export function autosaveNativeName(index: number): string {
    return 'autosave/' + index.toString();
}

export function autoSave() {
    if (autosaveIndex === null) {
        autosaveIndex = 0;
    } else {
        autosaveIndex = (autosaveIndex + 1) % AUTOSAVE_INDEX_MAX;
    }
    localStorage.setItem(autosaveNativeName(autosaveIndex), saveToString());
    writeAutosaveIndex();
    lastAutoSave.value = performance.now();
}

export function loadAutoSave() {
    if (autosaveIndex === null) return;
    let str = localStorage.getItem(autosaveNativeName(autosaveIndex));
    if (str === null) return;
    try {
        loadFromString(str);
    } catch (e) {
        // do nothing.
    }
}