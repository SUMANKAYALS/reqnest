import { Middleware }
    from "../types/middleware.js";

const pending =
    new Map<string, Promise<any>>();

export const dedupe:
    Middleware =
    async (ctx, next) => {

        /*
        |--------------------------------------------------------------------------
        | Dedupe Only GET Requests
        |--------------------------------------------------------------------------
        */

        if (
            ctx.config.method !==
            "GET"
        ) {

            return next();
        }

        /*
        |--------------------------------------------------------------------------
        | Unique Request Key
        |--------------------------------------------------------------------------
        */

        const key =
            JSON.stringify({
                method:
                    ctx.config.method,

                url:
                    ctx.config.url,

                params:
                    ctx.config.params,
            });

        /*
        |--------------------------------------------------------------------------
        | Return Existing Request
        |--------------------------------------------------------------------------
        */

        if (
            pending.has(key)
        ) {

            ctx.response =
                await pending.get(key);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Create Request Promise
        |--------------------------------------------------------------------------
        */

        const promise =
            (async () => {

                await next();

                return ctx.response;

            })();

        pending.set(
            key,
            promise
        );

        ctx.response =
            await promise;

        pending.delete(
            key
        );
    };