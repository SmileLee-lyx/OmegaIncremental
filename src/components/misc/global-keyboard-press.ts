import { runOnFrame } from "@/components/misc/run-on-frame.js";
import type { HotkeyEvent } from "@/core/Types.js";
import { onMounted, onUnmounted, reactive, ref } from "vue";

export let isShiftPressed = ref(false);
export let isCtrlPressed = ref(false);
export let pressedKeys: Record<string, number> = reactive({});

export function isValidHotkey(key: string): boolean {
    return key.length === 1 &&
        ((key >= '0' && key <= '9') ||
            (key >= 'a' && key <= 'z'));
}

export function isPressed(key: string): boolean {
    return pressedKeys[key.toLowerCase()] !== undefined;
}

export let HOTKEY_THRESHOLD = 500;

const hotkeyFromId: Record<string, string> = reactive({});
const registeredHotkeyEvents: Record<string, HotkeyEvent> = {};

(window as any).hotkeyFromId = hotkeyFromId;
(window as any).registeredHotkeyEvents = registeredHotkeyEvents;

export function getRegisteredEvent(key: string): HotkeyEvent | undefined {
    return registeredHotkeyEvents[key];
}

export function getRegisteredKey(id: string): string | undefined {
    return hotkeyFromId[id];
}

export function removeHotkeyByKey(key: string | undefined): void {
    if (key === undefined) return;
    let previous: HotkeyEvent | undefined = registeredHotkeyEvents[key];
    if (previous === undefined) return;
    delete registeredHotkeyEvents[key];
    delete hotkeyFromId[previous.id];
}

export function removeHotkeyById(id: string): void {
    removeHotkeyByKey(hotkeyFromId[id]);
}

export function registerHotkey(key: string, event: HotkeyEvent): void {
    removeHotkeyByKey(key);
    removeHotkeyById(event.id);
    registeredHotkeyEvents[key] = event;
    hotkeyFromId[event.id] = key;
}

export function clearHotkeys() {
    Object.keys(registeredHotkeyEvents).forEach(k => delete registeredHotkeyEvents[k]);
    Object.keys(hotkeyFromId).forEach(k => delete hotkeyFromId[k]);
}

function isKeyEventIgnored(e: KeyboardEvent): boolean {
    let target: HTMLElement | null = e.target as HTMLElement | null;
    if (target === null) return false;
    if (target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.isContentEditable
    ) return true;
    return false;
}

export function initKeyboardPress() {
    function handleKeyDownEvent(e: KeyboardEvent) {
        isShiftPressed.value = e.shiftKey;
        isCtrlPressed.value = e.ctrlKey;

        if (isKeyEventIgnored(e)) return;

        let key = e.key.toLowerCase();
        if (isValidHotkey(key) && pressedKeys[key] === undefined) {
            pressedKeys[key] = performance.now();
            if (registeredHotkeyEvents[key] !== undefined)
                registeredHotkeyEvents[key].action();
        }
    }

    function handleKeyUpEvent(e: KeyboardEvent) {
        isShiftPressed.value = e.shiftKey;
        isCtrlPressed.value = e.ctrlKey;

        if (isKeyEventIgnored(e)) return;

        let key = e.key.toLowerCase();
        if (isValidHotkey(key)) delete pressedKeys[key];
    }

    function handleBlurEvent(e: Event) {
        isShiftPressed.value = false;
        isCtrlPressed.value = false;
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeyDownEvent);
        window.addEventListener('keyup', handleKeyUpEvent);
        window.addEventListener('blur', handleBlurEvent);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyDownEvent);
        window.removeEventListener('keyup', handleKeyUpEvent);
        window.removeEventListener('blur', handleBlurEvent);
    });

    runOnFrame(() => {
        for (let key in pressedKeys) {
            if (pressedKeys[key] !== undefined &&
                registeredHotkeyEvents[key] !== undefined) {
                if (performance.now() - pressedKeys[key] > HOTKEY_THRESHOLD) {
                    registeredHotkeyEvents[key].action();
                }
            }
        }
    });
}