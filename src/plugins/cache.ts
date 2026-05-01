// import { Middleware } from "../types/middleware.js";

// const cache = new Map<string, any>();

// export const cachePlugin: Middleware = async (ctx, next) => {
//     const key = ctx.config.url;

//     if (cache.has(key)) {
//         ctx.response = cache.get(key);
//         next();
//         return;
//     }

//     await next();
//     cache.set(key, ctx.response);
// };



import { Middleware }
    from "../types/middleware.js";

const cache =
    new Map<string, any>();

export const cachePlugin:
    Middleware =
    async (ctx, next) => {

        /*
        |--------------------------------------------------------------------------
        | Cache Only GET Requests
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
        | Unique Cache Key
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
        | Return Cached Response
        |--------------------------------------------------------------------------
        */

        if (cache.has(key)) {

            ctx.response =
                cache.get(key);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Continue Middleware
        |--------------------------------------------------------------------------
        */

        await next();

        /*
        |--------------------------------------------------------------------------
        | Save Response
        |--------------------------------------------------------------------------
        */

        cache.set(
            key,
            ctx.response
        );
    };