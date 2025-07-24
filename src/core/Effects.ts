import type { WithEffect } from "@/core/Types.js";
import { error } from "@/util/util.js";
import OmegaNum from "omega_num.js";

export namespace Effects {
    export function sum(...items: WithEffect[]) {
        let result = new OmegaNum(0);
        for (let item of items) {
            if (item.effect === undefined) error('Effect undefined');
            let effect = item.effect();
            if (effect !== null) result = result.add(effect);
        }
        return result;
    }

    export function prod(...items: WithEffect[]) {
        let result = new OmegaNum(1);
        for (let item of items) {
            if (item.effect === undefined) error('Effect undefined');
            let effect = item.effect();
            if (effect !== null) result = result.mul(effect);
        }
        return result;
    }
}

export const TrivialEffect: WithEffect = {
    effect() { return null; },
};