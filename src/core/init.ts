import { player } from "@/core/global-objects.js";
import { registerSerializationHandler } from "@/core/save-load/serialization.js";
import { format } from "@/util/format.js";
import OmegaNum from "omega_num.js";

class OmegaNumHandler {
    static replacer(data: any): any {
        if (!(data instanceof OmegaNum)) return data;
        return {
            __type: 'OmegaNum',
            array: data.array,
            sign: data.sign,
        };
    }

    static reviver(data: any): any {
        if (typeof data !== 'object' || data === null) return data;
        if (data.__type !== 'OmegaNum') return data;
        return new OmegaNum(data.array, data.sign);
    }
}

class InfinityNumHandler {
    static replacer(data: any): any {
        if (typeof data === "number") {
            if (data === Infinity) {
                return {
                    __type: 'number',
                    value: 'Infinity',
                };
            } else if (data === -Infinity) {
                return {
                    __type: 'number',
                    value: '-Infinity',
                };
            } else if (Number.isNaN(data)) {
                return {
                    __type: 'number',
                    value: 'NaN',
                };
            }
        }
        return data;
    }

    static reviver(data: any): any {
        if (typeof data === "object" && data !== null && data.__type === 'number') {
            return Number(data.value);
        }
        return data;
    }
}

export function initGlobal() {
    delete (OmegaNum.prototype as any).toJSON;

    (window as any).OmegaNum = OmegaNum;
    (window as any).format = format;
    (window as any).player = player;

    registerSerializationHandler(OmegaNumHandler);
    registerSerializationHandler(InfinityNumHandler);
}