import type { FormattedText } from "@/util/format.js";
import { reactive } from "vue";

export interface AlertData {
    type: 'alert';
    messageText: FormattedText;
    done?: () => void;
}

export interface InputData {
    type: 'input_box';
    messageText: FormattedText;
    inputType?: 'string' | 'number';
    cancel?: () => void;
    done: (text: string) => boolean | void;
}

export interface ConfirmData {
    type: 'confirm';
    messageText: FormattedText;
    cancel?: () => void;
    done: () => boolean | void;
}

export type MessageData = AlertData | InputData | ConfirmData;

export interface HeaderMessageData {
    startTime: number;
    messageText: FormattedText;
}

export class MessageManager {
    messages: MessageData[];
    activeIndices: Set<number>;
    HEADER_MESSAGE_TIMEOUT: number;
    headers: HeaderMessageData[];

    constructor(timeout: number = 3000) {
        this.messages = reactive([]);
        this.activeIndices = reactive(new Set());
        this.HEADER_MESSAGE_TIMEOUT = timeout;
        this.headers = reactive([]);
    }


    addMessage(message: MessageData, show: boolean = true): number {
        const index = this.messages.length;
        this.messages.push(message);
        if (show) this.activeIndices.add(index);
        return index;
    }

    manualShowMessage(index: number) {
        this.activeIndices.add(index);
    }

    manualCloseMessage(index: number) {
        this.activeIndices.delete(index);
    }

    addHeaderMessage(data: FormattedText) {
        this.headers.push({
            startTime: performance.now(),
            messageText: data,
        });
    }

    removeHeaderMessageOnTimeout() {
        let index = 0;
        while (index < this.headers.length) {
            if (this.headers[index].startTime < performance.now() - this.HEADER_MESSAGE_TIMEOUT) {
                index++;
            } else {
                break;
            }
        }
        this.headers.splice(0, index);
    }
}

