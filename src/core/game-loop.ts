import { globalNow } from "@/components/misc/component-timer.js";
import { clearHotkeys } from "@/components/misc/global-keyboard-press.js";
import A from "@/core/game-items/A.js";
import Point from "@/core/game-items/point.js";
import { lastAutoSave, type PartialRecordsData, player, type RecordsData } from "@/core/global-objects.js";
import { autoSave } from "@/core/save-load/save-load.js";
import OmegaNum from "omega_num.js";

function updateTimeLayer(data: PartialRecordsData, duration: number, gameDuration: OmegaNum) {
    if (data.point === undefined) data.point = {};
    if (data.point.gameTime === undefined) data.point.gameTime = new OmegaNum(0);
    data.point.gameTime = data.point.gameTime.add(gameDuration);
    if (data.point.realTime === undefined) data.point.realTime = 0;
    data.point.realTime += duration;
}

function updateGameTime(duration: number) {
    updateTimeLayer(player.records.historical, duration, new OmegaNum(duration));
    let layer: keyof RecordsData;
    for (layer in player.records.current) {
        updateTimeLayer(player.records.current[layer], duration, new OmegaNum(duration));
    }
}

function checkAutoSave() {
    let threshold: number;
    if (player.settings.autoSaveMode === undefined || player.settings.autoSaveMode === 'every30Seconds') {
        threshold = 30000;
    } else if (player.settings.autoSaveMode === 'every5Min') {
        threshold = 300000;
    } else {
        return;
    }

    if (lastAutoSave.value === null) {
        lastAutoSave.value = globalNow.value;
    } else if (globalNow.value - lastAutoSave.value >= threshold) {
        autoSave();
    }
}

export function initGame() {
    clearHotkeys();

    lastAutoSave.value = globalNow.value;

    Point.init();
    A.init();
}

export function gameLoop(duration: number) {
    player.META.timeStamp = Date.now();
    updateGameTime(duration);
    Point.gameLoop(duration);
    A.gameLoop(duration);

    checkAutoSave();
}