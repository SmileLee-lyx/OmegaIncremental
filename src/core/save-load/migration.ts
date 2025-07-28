import { initGame } from "@/core/game-loop.js";
import { player, VERSION } from "@/core/global-objects.js";
import { fullReset } from "@/core/save-load/save-load.js";
import { error } from "@/util/util.js";
import _ from "lodash";

export function loadFromObject(data: any) {
    fullReset();
    let version: number = data?.META?.saveVersion;
    if (version === undefined) error('not save');
    if (version > VERSION) error('unknown version');

    data.META.saveVersion = VERSION;

    _.merge(player, data);

    initGame();
}