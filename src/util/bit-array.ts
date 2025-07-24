import { error } from "@/util/util.js";

const MAX_LENGTH: number = 65536;

export function getBit(array: number[], index: number): boolean {
    if (index < 0 || index >= MAX_LENGTH) error('Invalid index');
    return (((array[index >> 4] ?? 0) >> (index & 15)) & 1) !== 0;
}

export function setBit(array: number[], index: number, value: boolean) {
    if (index < 0 || index >= MAX_LENGTH) error('Invalid index');
    array[index >> 4] = array[index >> 4] ?? 0;
    if (value) {
        array[index >> 4] |= (1 << (index & 15));
    } else {
        array[index >> 4] &= (~(1 << (index & 15)));
    }
}

(window as any).getBit = getBit;
(window as any).setBit = setBit;