import { MessageManager } from "@/util/message-manager.js";

export const GlobalMessages: MessageManager = new MessageManager();

(window as any).GlobalMessages = GlobalMessages;