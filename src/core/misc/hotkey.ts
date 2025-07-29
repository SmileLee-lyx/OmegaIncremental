import { globalNow } from "@/core/misc/component-timer.js";
import { isValidHotkey, pressedKeys } from "@/core/misc/global-keyboard-press.js";
import { runOnFrame } from "@/core/misc/run-on-frame.js";
import type { HotkeyEvent } from "@/core/Types.js";
import { onMounted, onUnmounted, reactive } from "vue";

export let HOTKEY_THRESHOLD = 500;

const registeredHotkeyEvents: Record<string, HotkeyEvent> = reactive({});

(window as any).registeredHotkeyEvents = registeredHotkeyEvents;

export function getRegisteredEvent(key: string): HotkeyEvent | undefined {
    return registeredHotkeyEvents[key];
}

export function getRegisteredKey(id: string): string | undefined {
    let key: string;
    for (key in registeredHotkeyEvents) {
        if (registeredHotkeyEvents[key].id === id) return key;
    }
    return undefined;
}

export function removeHotkeyByKey(key: string | undefined): void {
    if (key === undefined) return;
    delete registeredHotkeyEvents[key];
}

export function removeHotkeyById(id: string): void {
    removeHotkeyByKey(getRegisteredKey(id));
}

export function registerHotkey(key: string, event: HotkeyEvent): void {
    removeHotkeyByKey(key);
    removeHotkeyById(event.id);
    registeredHotkeyEvents[key] = event;
}

export function clearHotkeys() {
    for (let key in registeredHotkeyEvents) { 
        delete registeredHotkeyEvents[key]; 
    }
}

export function runHotkeyAction(key: string): void {
    if (registeredHotkeyEvents[key] !== undefined) {
        registeredHotkeyEvents[key].action();
    }
}

export function initHotkey() {
    function actionOnKeyDown(e: KeyboardEvent) {
        let key = e.key.toLowerCase();
        if (isValidHotkey(key) && !e.repeat) {
            runHotkeyAction(key);
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', actionOnKeyDown);
    })
    onUnmounted(() => {
        window.removeEventListener('keydown', actionOnKeyDown);
    })

    runOnFrame(() => {
        for (let key in pressedKeys) {
            if (pressedKeys[key] !== undefined &&
                performance.now() - pressedKeys[key] > HOTKEY_THRESHOLD) {
                runHotkeyAction(key);
            }
        }
    });
}
