import { MessageManager } from "@/util/message-manager.js";
import { reactive } from "vue";

export const GlobalMessages: MessageManager = new MessageManager();

(window as any).GlobalMessages = GlobalMessages;