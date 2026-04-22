import { Middleware } from "../types/middleware.js";
import { ReqnestContext } from "../types/context.js";

export class Pipeline {
    private middlewares: Middleware[] = [];

    use(mw: Middleware) {
        this.middlewares.push(mw);
    }

    async run(ctx: ReqnestContext) {
        const dispatch = async (i: number): Promise<void> => {
            if (i >= this.middlewares.length) return;

            const fn = this.middlewares[i];

            let called = false;

            await fn(ctx, async () => {
                if (called) {
                    throw new Error("next() called multiple times");
                }

                called = true;
                await dispatch(i + 1);
            });
        };

        await dispatch(0);
    }
}

// import { Middleware } from "../types/middleware.js";
// import { ReqnestContext } from "../types/context.js";

// export class Pipeline {
//     private middlewares: Middleware[] = [];

//     use(mw: Middleware) {
//         this.middlewares.push(mw);
//     }

//     async run(ctx: ReqnestContext) {
//         const dispatch = async (i: number): Promise<void> => {
//             if (i >= this.middlewares.length) return;

//             const fn = this.middlewares[i];

//             let called = false;

//             await fn(ctx, async () => {
//                 if (called) {
//                     throw new Error("next() called multiple times");
//                 }

//                 called = true;

//                 await dispatch(i + 1);
//             });
//         };

//         await dispatch(0);
//     }
// }