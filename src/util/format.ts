import { error } from "@/util/util.js";
import OmegaNum, { type OmegaNumSource } from "omega_num.js";

function formatPow10(mag: number): string {
    if (mag < 4 || mag > 1e6) error('Invalid mag.');
    let b = Math.floor(mag);
    let a = Math.pow(10, mag - b);
    let result = a.toPrecision(6);
    if (result.startsWith('10')) {
        result = '1.00';
        b++;
    }
    return result + 'e' + b;
}

function formatOmegaNumArray(array: Array<number>): string {
    if (array.length == 0) return "0";
    if (!Number.isFinite(array[0])) return "Infinity";
    if (array[0] < 1) return array[0].toFixed(5);

    let flag = false;
    for (let i = array.length - 1; i >= 0; i--) {
        if (flag && i > 0) {
            array[i] = 0;
            continue;
        }
        if (array[i] >= 1e6 || (i == 0 && array[i].toPrecision(6) == '1.00000e+6')) {
            let j = i;
            while (array[j] >= 1e6 || j == 0) {
                array[0] = (j == 0 ? Math.log10(array[0]) : array[j]);
                if (j != 0) array[j] = 0;
                array[j + 1] = (j + 1 < array.length ? array[j + 1] + 1 : 1);
                ++j;
            }
            flag = true;
            if (i == 0) ++i;
        }
    }

    array.push(0);
    let has1 = false;
    if (array[1] != 0) {
        has1 = true;
        array[1]--;
    }

    let count = 0;
    let result = "";

    for (let i = array.length - 1; i > 0; i--) {
        if (array[i] == 0) continue;
        if (count == 5) {
            result += "...";
            break;
        }
        count++;
        if (i == 1 && array[i] < 5) {
            for (let j = 0; j < array[i]; ++j) result += "e";
        } else {
            let single = "10";
            if (i < 5) {
                for (let j = 0; j < i; ++j) single += "^";
            } else {
                single += "{" + i + "}";
            }
            if (array[i] <= 2) {
                for (let j = 0; j < array[i]; ++j) result += single;
            } else {
                result += "(" + single + ")^" + array[i] + " ";
            }
        }
    }
    if (has1) {
        result += formatPow10(array[0]);
    } else {
        result += array[0].toPrecision(6);
    }
    return result;
}

export function format(num: OmegaNumSource): string {
    num = new OmegaNum(num);
    let array = num.array.slice(0);
    let sign = num.sign;
    if (num.isNaN()) return "NaN";
    if (num.eq(0)) return "0";
    if (sign < 0) {
        return "-" + formatOmegaNumArray(array);
    } else {
        return formatOmegaNumArray(array);
    }
}

export class FormattedTextParam {
    name: string | null;

    constructor(name: string | null) {
        this.name = name;
    }
}

export type FormattedTextImpl<P> = null | FormattedTextImpl<P>[] | string | number | OmegaNum | P |
    { type: 'span' | 'sub', classes?: string[], text: FormattedTextImpl<P>, } |
    { type: 'br' };

export type FormattedText = FormattedTextImpl<never>;
export type PFormattedText = FormattedTextImpl<FormattedTextParam>;

export type FormattedTextArgs = Record<string, PFormattedText | (() => PFormattedText)>;

export function resolveFormattedText(
    text: PFormattedText,
    args?: FormattedTextArgs): FormattedText {
    args = args ?? {};
    if (text === null || text === undefined) return null;
    if (Array.isArray(text)) return text.map((t) => resolveFormattedText(t, args));
    if (typeof text === 'string' || typeof text === 'number' || text instanceof OmegaNum) return text;
    if (text instanceof FormattedTextParam) {
        if (text.name !== null) {
            let arg: PFormattedText | (() => PFormattedText) = args[text.name];
            if (typeof arg === 'function') arg = arg();
            return resolveFormattedText(arg, args);
        }

        let result: FormattedText[] = ['{'];
        for (let name in args) {
            result.push(`${ name }: `);
            let arg: PFormattedText | (() => PFormattedText) = args[name];
            if (typeof arg === 'function') arg = arg();
            result.push(resolveFormattedText(arg, args));
            result.push(', ');
        }
        if (result.length > 1) result.pop();
        result.push('}');
        return result;
    }
    if (text.type === 'br') return text;
    return { type: text.type, classes: text.classes, text: resolveFormattedText(text.text, args) };
}

export function br(): FormattedText {
    return { type: 'br' };
}

export function param(name: string): PFormattedText {
    return new FormattedTextParam(name);
}

export function params(): PFormattedText {
    return new FormattedTextParam(null);
}

export function large<P>(text: FormattedTextImpl<P>, ...extra_classes: string[]): FormattedTextImpl<P> {
    return { type: 'span', classes: ['large', ...extra_classes], text: text };
}

export function small<P>(text: FormattedTextImpl<P>, ...extra_classes: string[]): FormattedTextImpl<P> {
    return { type: 'span', classes: ['small', ...extra_classes], text: text };
}

export function fixed_width<P>(text: FormattedTextImpl<P>, ...extra_classes: string[]): FormattedTextImpl<P> {
    return { type: 'span', classes: ['fixed-width', ...extra_classes], text: text };
}

export function sub<P>(text: FormattedTextImpl<P>, ...classes: string[]): FormattedTextImpl<P> {
    return { type: 'sub', classes: [...classes], text: text };
}

export function pointText<P>(text: FormattedTextImpl<P>, ...extra_classes: string[]): FormattedTextImpl<P> {
    return { type: 'span', classes: ['point-text', ...extra_classes], text: text };
}

export function AText<P>(text: FormattedTextImpl<P>, ...extra_classes: string[]): FormattedTextImpl<P> {
    return { type: 'span', classes: ['A-text', ...extra_classes], text: text };
}