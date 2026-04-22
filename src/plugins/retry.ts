// import { Middleware } from "../types/middleware.js";
// import { delay } from "../utils/delay.js";

// export const retry = (max = 3): Middleware => {
//     return async (ctx, next) => {
//         let attempt = 0;

//         while (attempt < max) {
//             try {
//                 await next();
//                 return;
//             } catch (err) {
//                 attempt++;
//                 if (attempt >= max) throw err;

//                 await delay(2 ** attempt * 100);
//             }
//         }
//     };
// };


import { Middleware } from "../types/middleware.js";

export const retry = (retries = 2): Middleware => {
    return async (ctx, next) => {
        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Run full chain once
                await next();

                // success
                if (!ctx.error) return;

            } catch (err) {
                lastError = err;
                ctx.error = err;

                if (attempt === retries) {
                    throw err; //  final failure
                }
            }

            // Reset state before retry
            ctx.error = undefined;
            ctx.response = undefined;
        }

        throw lastError;
    };
};