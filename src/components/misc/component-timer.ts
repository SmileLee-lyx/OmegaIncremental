import { runOnFrame } from "@/components/misc/run-on-frame.ts";
import { ref, type Ref } from "vue";

export const globalNow: Ref<number> = ref(performance.now());

export function initTimer() {
    runOnFrame(() => { globalNow.value = performance.now(); });
}