import { Middleware } from "../types/middleware.js";

export const rateLimit = (limit = 3): Middleware => {
    let active = 0;
    const queue: Function[] = [];

    const run = () => {
        if (queue.length && active < limit) {
            active++;
            queue.shift()!();
        }
    };

    return async (ctx, next) => {
        await new Promise<void>((resolve) => {
            queue.push(resolve);
            run();
        });

        try {
            await next();
        } finally {
            active--;
            run();
        }
    };
};