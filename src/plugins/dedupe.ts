import { Middleware } from "../types/middleware.js";

const pending = new Map<string, Promise<any>>();

export const dedupe: Middleware = async (ctx, next) => {
    const key = ctx.config.url;

    if (pending.has(key)) {
        ctx.response = await pending.get(key);
        return;
    }

    const promise = (async () => {
        await next();
        return ctx.response;
    })();

    pending.set(key, promise);

    ctx.response = await promise;

    pending.delete(key);
};