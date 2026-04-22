// import { Pipeline } from "./pipeline.js";
// import { Middleware } from "../types/middleware.js";
// import { ReqnestRequestConfig } from "../types/request.js";
// import { ReqnestContext } from "../types/context.js";
// import { mergeConfig } from "../utils/mergeConfig.js";

// export class Reqnest {
//     private pipeline = new Pipeline();
//     private defaults: ReqnestRequestConfig;

//     constructor(config: Partial<ReqnestRequestConfig> = {}) {
//         this.defaults = config as ReqnestRequestConfig;
//     }

//     // 🔌 add middleware
//     use(mw: Middleware) {
//         this.pipeline.use(mw);
//     }

//     // 🚀 core request method
//     async request<T = any>(
//         config: ReqnestRequestConfig
//     ): Promise<any> {
//         const finalConfig = mergeConfig(this.defaults, config);

//         const ctx: ReqnestContext<T> = {
//             config: finalConfig,
//         };

//         await this.pipeline.run(ctx);

//         // ❌ throw error if exists
//         if (ctx.error) {
//             throw ctx.error;
//         }

//         // ✅ FIX (IMPORTANT)
//         return ctx.response;
//     }

//     // ✅ GET
//     get(url: string, config?: Partial<ReqnestRequestConfig>) {
//         return this.request({
//             ...config,
//             url,
//             method: "GET",
//         } as ReqnestRequestConfig);
//     }

//     // ✅ POST
//     post(
//         url: string,
//         data?: any,
//         config?: Partial<ReqnestRequestConfig>
//     ) {
//         return this.request({
//             ...config,
//             url,
//             method: "POST",
//             data,
//         } as ReqnestRequestConfig);
//     }

//     // 🔥 ADD MORE METHODS (OPTIONAL)
//     put(url: string, data?: any, config?: Partial<ReqnestRequestConfig>) {
//         return this.request({
//             ...config,
//             url,
//             method: "PUT",
//             data,
//         } as ReqnestRequestConfig);
//     }

//     delete(url: string, config?: Partial<ReqnestRequestConfig>) {
//         return this.request({
//             ...config,
//             url,
//             method: "DELETE",
//         } as ReqnestRequestConfig);
//     }
// }



import { Pipeline } from "./pipeline.js";
import { Middleware } from "../types/middleware.js";
import { ReqnestRequestConfig } from "../types/request.js";
import { ReqnestContext } from "../types/context.js";
import { mergeConfig } from "../utils/mergeConfig.js";

export class Reqnest {
    private pipeline = new Pipeline();
    private defaults: ReqnestRequestConfig;

    constructor(config: Partial<ReqnestRequestConfig> = {}) {
        this.defaults = config as ReqnestRequestConfig;
    }

    use(mw: Middleware) {
        this.pipeline.use(mw);
    }

    async request<T = any>(config: ReqnestRequestConfig): Promise<any> {
        const finalConfig = mergeConfig(this.defaults, config);

        const retries = finalConfig.retry ?? 0;

        let lastError: any;

        for (let attempt = 0; attempt <= retries; attempt++) {
            const ctx: ReqnestContext<T> = {
                config: finalConfig,
            };

            try {
                await this.pipeline.run(ctx);

                if (ctx.error) throw ctx.error;

                return ctx.response;

            } catch (err) {
                lastError = err;

                if (attempt === retries) throw err;
            }
        }

        throw lastError;
    }

    get(url: string, config?: Partial<ReqnestRequestConfig>) {
        return this.request({ ...config, url, method: "GET" });
    }

    post(url: string, data?: any, config?: Partial<ReqnestRequestConfig>) {
        return this.request({ ...config, url, method: "POST", data });
    }

    put(url: string, data?: any, config?: Partial<ReqnestRequestConfig>) {
        return this.request({ ...config, url, method: "PUT", data });
    }

    patch(url: string, data?: any, config?: Partial<ReqnestRequestConfig>) {
        return this.request({ ...config, url, method: "PATCH", data });
    }

    delete(url: string, config?: Partial<ReqnestRequestConfig>) {
        return this.request({ ...config, url, method: "DELETE" });
    }
}