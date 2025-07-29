import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

export const isShiftKeyPressed = ref(false);
export const isCtrlKeyPressed = ref(false);
export const isShiftButtonPressed = ref(false);
export const isCtrlButtonPressed = ref(false);

export const isShift = computed(() =>
    isShiftKeyPressed.value || isShiftButtonPressed.value);
export const isCtrl = computed(() =>
    isCtrlKeyPressed.value || isCtrlButtonPressed.value);

export let pressedKeys: Record<string, number> = reactive({});

export function isValidHotkey(key: string): boolean {
    return key.length === 1 &&
        ((key >= '0' && key <= '9') ||
            (key >= 'a' && key <= 'z'));
}

export function isPressed(key: string): boolean {
    return pressedKeys[key.toLowerCase()] !== undefined;
}

export function handleKeyDown(key: string) {
    if (isValidHotkey(key) && pressedKeys[key] === undefined) {
        pressedKeys[key] = performance.now();
    }
}

export function handleKeyUp(key: string) {
    if (isValidHotkey(key)) delete pressedKeys[key];
}

export function initKeyboardPress() {
    function isKeyEventIgnored(e: KeyboardEvent): boolean {
        if (e.repeat) return true;
        let target: HTMLElement | null = e.target as HTMLElement | null;
        if (target === null) return false;
        return target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea' ||
            target.isContentEditable;
    }

    function handleKeyDownEvent(e: KeyboardEvent) {
        isShiftKeyPressed.value = e.shiftKey;
        isCtrlKeyPressed.value = e.ctrlKey;

        if (isKeyEventIgnored(e)) return;

        handleKeyDown(e.key.toLowerCase());
    }

    function handleKeyUpEvent(e: KeyboardEvent) {
        isShiftKeyPressed.value = e.shiftKey;
        isCtrlKeyPressed.value = e.ctrlKey;

        if (isKeyEventIgnored(e)) return;

        handleKeyUp(e.key.toLowerCase());
    }

    function handleBlurEvent(e: Event) {
        isShiftKeyPressed.value = false;
        isCtrlKeyPressed.value = false;
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
}