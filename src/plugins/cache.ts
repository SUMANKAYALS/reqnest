import { Middleware } from "../types/middleware.js";

const cache = new Map<string, any>();

export const cachePlugin: Middleware = async (ctx, next) => {
    const key = ctx.config.url;

    if (cache.has(key)) {
        ctx.response = cache.get(key);
        next();
        return;
    }

    await next();
    cache.set(key, ctx.response);
};