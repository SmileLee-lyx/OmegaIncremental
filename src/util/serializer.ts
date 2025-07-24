/**
 * replacer 和 reviver 都应当是幂等的.
 * rep(rev(rep(x))) = rep(x), rev(rep(rev(x))) = rev(x).
 */
export interface SerializationHandler {
    replacer(data: any): any;

    reviver(data: any): any;
}

/**
 * handlers 被假定是正交的, 即 h1.rep(h2.rep(x)) = h2.rep(h1.rep(x)),
 * 类似的结论对 rev 成立.
 */
export class ComposedHandler implements SerializationHandler {
    handlers: SerializationHandler[];

    constructor(...handlers: SerializationHandler[]) {
        this.handlers = [];
        for (const handler of handlers) {
            if (handler instanceof ComposedHandler) {
                this.handlers.push(...handler.handlers);
            } else if (handler instanceof TrivialHandler) {
                // do nothing
            } else {
                this.handlers.push(handler);
            }
        }
    }

    replacer(data: any): any {
        for (let i = 0; i < this.handlers.length; i++) {
            let handler = this.handlers[i];
            data = handler.replacer(data);
        }
        return data;
    }

    reviver(data: any): any {
        for (let i = this.handlers.length - 1; i >= 0; i--) {
            let handler = this.handlers[i];
            data = handler.reviver(data);
        }
        return data;
    }
}

export class TrivialHandler {
    static INSTANCE = new TrivialHandler();

    private constructor() {}

    replacer(data: any): any {
        return data;
    }

    reviver(data: any): any {
        return data;
    }
};

export class Serializer {
    handler: SerializationHandler;

    constructor(handler: SerializationHandler) {
        this.handler = handler;
    }

    serialize(data: any): string {
        return JSON.stringify(data, (_, v) => this.handler.replacer(v));
    }

    deserialize(json: string): any {
        return JSON.parse(json, (_, v) => this.handler.reviver(v));
    }
}