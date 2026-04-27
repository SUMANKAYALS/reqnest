import { Middleware } from "../types/middleware.js";

export const retry = (retries = 2): Middleware => {
    return async (ctx, next) => {
        let attempt = 0;
        let lastError: unknown;

        const run = async (): Promise<void> => {
            try {
                await next();

                // ✅ If no error → success
                if (!ctx.error) return;

                throw ctx.error;
            } catch (err) {
                lastError = err;

                if (attempt >= retries) {
                    throw err; // ❌ final failure
                }

                attempt++;

                // 🔄 Reset state before retry
                ctx.error = undefined;
                ctx.response = undefined;

                return run(); // 🔁 controlled retry
            }
        };

        await run();
    };
};


// import { Middleware } from "../types/middleware.js";

// export const retry = (retries = 2): Middleware => {
//     return async (ctx, next) => {
//         let lastError;

//         for (let attempt = 0; attempt <= retries; attempt++) {
//             try {
//                 // Run full chain once
//                 await next();

//                 // success
//                 if (!ctx.error) return;

//             } catch (err) {
//                 lastError = err;
//                 ctx.error = err;

//                 if (attempt === retries) {
//                     throw err; //  final failure
//                 }
//             }

//             // Reset state before retry
//             ctx.error = undefined;
//             ctx.response = undefined;
//         }

//         throw lastError;
//     };
// };