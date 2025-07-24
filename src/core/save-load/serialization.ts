import { ComposedHandler, type SerializationHandler, Serializer, TrivialHandler } from "@/util/serializer.js";

let globalHandler: SerializationHandler = TrivialHandler.INSTANCE;

export function registerSerializationHandler(handler: SerializationHandler) {
    globalHandler = new ComposedHandler(handler);
}

export function serialize(data: any): string {
    return new Serializer(globalHandler).serialize(data);
}

export function deserialize(json: string): any {
    return new Serializer(globalHandler).deserialize(json);
}

(window as any).registerSerializationHandler = registerSerializationHandler;
(window as any).serialize = serialize;
(window as any).deserialize = deserialize;