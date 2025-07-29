<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { GlobalMessages } from "@/core/global-messages.js";
import { player } from "@/core/global-objects.js";
import { isValidHotkey } from "@/core/misc/global-keyboard-press.js";
import {
    autoSave,
    deleteSlot,
    fullReset,
    loadFromString,
    readSaveFromSlot,
    saveSlots,
    saveToString,
    slotExists,
    writeSaveToSlot,
} from "@/core/save-load/save-load.js";
import { text } from "@/text/text.js";
import { type FormattedText, resolveFormattedText } from "@/util/format.js";
import { type Ref, ref } from "vue";

const RESET_STR = 'Lorem ipsum dolor sit amet';

function reset() {
    GlobalMessages.addMessage({
        type: 'input_box',
        messageText: resolveFormattedText(text('settings.full-reset.confirm'),
            { str: RESET_STR }),
        done(inputText) {
            if (inputText === RESET_STR) {
                fullReset();
            } else {
                GlobalMessages.addHeaderMessage(
                    resolveFormattedText(text('settings.full-reset.wrong-confirm')),
                );
                return true;
            }
        },
    });
}

const EXPORT_PREFIX = 'OmegaIncrementalSaveStart';
const EXPORT_POSTFIX = 'OmegaIncrementalSaveEnd';

function exportSave() {
    let saveText = saveToString(true);
    let exportText = EXPORT_PREFIX + saveText + EXPORT_POSTFIX;

    navigator.clipboard.writeText(exportText).then(() => {
        GlobalMessages.addHeaderMessage(resolveFormattedText(text('settings.export.success')));
    }).catch(e => {
        GlobalMessages.addHeaderMessage(resolveFormattedText(text('settings.export.failure')));
    });
}

let showImport = ref(false);
let importContent: Ref<string> = ref('');

function confirmImport() {
    showImport.value = false;

    let importText = importContent.value.trim();
    if (!(importText.startsWith(EXPORT_PREFIX) && importText.endsWith(EXPORT_POSTFIX))) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.import.wrong-format')));
        return;
    }
    let saveText = importText.substring(EXPORT_PREFIX.length,
        importText.length - EXPORT_POSTFIX.length);
    try {
        loadFromString(saveText, true);
    } catch (e) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.import.parse-error')),
        );
        return;
    }
    GlobalMessages.addHeaderMessage(
        resolveFormattedText(text('settings.import.success')),
    );
}

let showSaveLoad = ref(false);
let selectedSave: Ref<string | null> = ref(null);

function saveImpl(slot: string) {
    try {
        writeSaveToSlot(slot);
    } catch (e) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.save.failure'),
                { slot: slot }),
        );
        return;
    }
    GlobalMessages.addHeaderMessage(
        resolveFormattedText(text('settings.save.success'),
            { slot: slot }),
    );
}

function save() {
    const slot: string | null = selectedSave.value;
    if (slot === null) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.save-load.should-select-slot')),
        );
        return;
    }
    if (slotExists(slot)) {
        GlobalMessages.addMessage({
            type: 'confirm',
            messageText: resolveFormattedText(text('settings.save.confirm')),
            done() {
                saveImpl(slot);
            },
        });
    } else {
        saveImpl(slot);
    }
}

function loadImpl(slot: string) {
    try {
        readSaveFromSlot(slot);
    } catch (e) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.load.failure'),
                { slot: slot }),
        );
        return;
    }
    GlobalMessages.addHeaderMessage(
        resolveFormattedText(text('settings.load.success'),
            { slot: slot }),
    );
}

function load() {
    let slot: string | null = selectedSave.value;
    if (slot === null) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.save-load.should-select-slot')),
        );
        return;
    }
    GlobalMessages.addMessage({
        type: 'confirm',
        messageText: resolveFormattedText(text('settings.load.confirm')),
        done() {
            loadImpl(slot);
        },
    });
}

function deleteSave() {
    if (selectedSave.value === null) {
        GlobalMessages.addHeaderMessage(
            resolveFormattedText(text('settings.save-load.should-select-slot')),
        );
        return;
    }
    let slot = selectedSave.value;
    GlobalMessages.addMessage({
        type: 'confirm',
        messageText: resolveFormattedText(text('settings.delete.confirm'), { slot }),
        done() {
            deleteSlot(slot);
            GlobalMessages.addHeaderMessage(
                resolveFormattedText(text('settings.delete.success'), { slot }),
            );
        },
    });
}

/**
 * 由数字, 字母, 空格, 连字符, 下划线构成
 * @param name
 */
function isValidName(name: string): boolean {
    name = name.toLowerCase();
    for (let i = 0; i < name.length; i++) {
        let char = name[i];
        if (char >= '0' || char <= '9') continue;
        if (char >= 'a' && char <= 'z') continue;
        if (char === ' ' || char === '-' || char === '_') continue;
        return false;
    }
    return true;
}

function newSave() {
    GlobalMessages.addMessage({
        type: 'input_box',
        messageText: resolveFormattedText(text('settings.new.instruction')),
        done(name) {
            if (!isValidName(name)) {
                GlobalMessages.addHeaderMessage(
                    resolveFormattedText(text('settings.new.illegal-name')),
                );
                return;
            }
            saveSlots.add(name);
            GlobalMessages.addHeaderMessage(
                resolveFormattedText(text('settings.new.success')),
            );
        },
    });
}

function toggleVirtualKey() {
    player.settings.showVirtualKey = !player.settings.showVirtualKey;
}

function virtualKeyButtonContent(): FormattedText {
    return resolveFormattedText(text('settings.virtual.show'),
        {
            show: player.settings.showVirtualKey ?
                text('settings.show.on') : text('settings.show.off'),
        },
    );
}

function setVirtualKey() {
    GlobalMessages.addMessage({
        type: 'input_box',
        messageText: resolveFormattedText(text('settings.virtual.input')),
        done(keyStr) {
            let keys = [...keyStr].filter(k => isValidHotkey(k));
            if (keys.length > 3) keys.splice(3);
            player.settings.virtualKeys = keys;
        },
    });
}
</script>

<template>
    <div class="main-text">
        <div class="fixed-width-panel" style="width: 650px">
            <button class="upgrade-button settings" @click="reset()">
                <TextFormatter :text="text('settings.full-reset')"/>
            </button>
            <button class="upgrade-button settings" @click="autoSave()">
                <TextFormatter :text="text('settings.manual-autosave')"/>
            </button>
            <button class="upgrade-button settings" @click="exportSave()">
                <TextFormatter :text="text('settings.export')"/>
            </button>
            <button class="upgrade-button settings" @click="showImport = true">
                <TextFormatter :text="text('settings.import')"/>
            </button>
            <button class="upgrade-button settings" @click="showSaveLoad = true">
                <TextFormatter :text="text('settings.save-load')"/>
            </button>
            <button class="upgrade-button settings" @click="toggleVirtualKey()">
                <TextFormatter :text="virtualKeyButtonContent()"/>
            </button>
            <button class="upgrade-button settings" @click="setVirtualKey()">
                <TextFormatter :text="text('settings.virtual')"/>
            </button>
        </div>
    </div>

    <div v-if="showImport" class="modal-overlay" @click="showImport = false">
        <div class="modal-content" @click.stop>
            <textarea v-model="importContent"
                      class="import-textarea"/>
            <div class="modal-actions">
                <button class="confirm-btn" @click="confirmImport()">
                    <TextFormatter :text="text('settings.confirm')"/>
                </button>
                <button class="confirm-btn" @click="showImport = false">
                    <TextFormatter :text="text('settings.cancel')"/>
                </button>
            </div>
        </div>
    </div>

    <div v-if="showSaveLoad" class="modal-overlay" @click="showSaveLoad = false">
        <div class="modal-content" @click.stop>
            <div class="saveload-slots">
                <div v-for="slot in saveSlots" :key="slot"
                     :class="{selected: slot === selectedSave}"
                     class="saveload-slot"
                     @click="selectedSave = slot"
                >
                    {{ slot }}
                </div>
            </div>
            <div class="modal-actions">
                <button class="confirm-btn" @click="save()">
                    <TextFormatter :text="text('settings.save')"/>
                </button>
                <button class="confirm-btn" @click="load()">
                    <TextFormatter :text="text('settings.load')"/>
                </button>
                <button class="confirm-btn" @click="deleteSave()">
                    <TextFormatter :text="text('settings.delete')"/>
                </button>
                <button class="confirm-btn" @click="newSave()">
                    <TextFormatter :text="text('settings.new')"/>
                </button>
                <button class="confirm-btn" @click="showSaveLoad = false">
                    <TextFormatter :text="text('settings.cancel')"/>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.import-textarea {
    width: 100%;
    height: 200px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
    box-sizing: border-box;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
}

.confirm-btn {
    position: relative;
    padding: 8px 16px;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    overflow: hidden;
}

.confirm-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.confirm-btn:hover::before {
    opacity: 1;
}

.saveload-slots {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
}

.saveload-slot {
    position: relative;
    display: inline-flex;
    border: #000 solid 1px;
    border-radius: 4px;
    text-align: center;
    align-items: center;
    justify-content: center;

    height: 60px;
    user-select: none;
}

.saveload-slot.selected {
    background-color: #ccc;
}

.saveload-slot::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.saveload-slot:hover::before {
    opacity: 1;
}
</style>