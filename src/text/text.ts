import { player } from "@/core/global-objects.js";
import { text_zh, text_zh_impl } from "@/text/zh.js";
import { type FormattedText, params, type PFormattedText, resolveFormattedText } from "@/util/format.js";
import OmegaNum from "omega_num.js";
import { computed, type ComputedRef } from "vue";

let textSource: ComputedRef<Record<string, PFormattedText>> = computed(() => text_zh);

export type TextId = keyof typeof text_zh_impl;

export let DEFAULT_KEY: TextId | null = 'default';

/**
 * 返回 key 对应的文本.
 * 当 key 不存在时, 根据
 *
 * @param key
 * @param defaultKey
 */

export function text(key: TextId, defaultKey: TextId | null = DEFAULT_KEY): PFormattedText {
    if (key in textSource.value) return textSource.value[key];
    if (typeof defaultKey === 'string') { return textSource.value[defaultKey]; }
    return ['$', key, ': ', params()];
}

export function formatTime(time: OmegaNum | number): FormattedText {
    time = new OmegaNum(time);
    if (player.settings.timeMode === 'seconds' || time.lt(0)) {
        return resolveFormattedText(text('time.s'), { s: time });
    }
    if (time.lte(86400 * 365.2425)) {
        let timeNum = time.toNumber();
        let s = Math.floor(timeNum) % 60;
        let min = Math.floor(timeNum / 60) % 60;
        let h = Math.floor(timeNum / 3600) % 24;
        let d = Math.floor(timeNum / 86400);
        let textId: TextId;

        if (d !== 0) {
            textId = 'time.d';
        } else if (h !== 0) {
            textId = 'time.h';
        } else if (min !== 0) {
            textId = 'time.min';
        } else {
            textId = 'time.s';
        }

        return resolveFormattedText(text(textId), { d, h, min, s });
    }
    return resolveFormattedText(text('time.y'), { y: time.div(86400 * 365.2425) });
}