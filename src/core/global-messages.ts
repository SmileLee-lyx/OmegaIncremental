import { player } from "@/core/global-objects.js";
import { type PFormattedText, resolveFormattedText } from "@/util/format.js";
import { MessageManager } from "@/util/message-manager.js";
import { toBoolean } from "@/util/util.js";

export const GlobalMessages: MessageManager = new MessageManager();

(window as any).GlobalMessages = GlobalMessages;

export function alertOnce(
    alertId: string,
    condition: boolean | (() => boolean),
    message: PFormattedText,
) {
    if (player.game.shownAlerts.includes(alertId)) return;
    if (!toBoolean(condition, false)) return;
    player.game.shownAlerts.push(alertId);
    GlobalMessages.addMessage({
        type: 'alert',
        messageText: resolveFormattedText(message),
    });
}