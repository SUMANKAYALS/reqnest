// import { Middleware } from "../types/middleware.js";
// import { buildURL } from "../utils/buildURL.js";
// import { ReqnestError } from "../errors/ReqnestError.js";

// export const dispatch: Middleware = async (ctx, next) => {
//   const { config } = ctx;

//   const controller = new AbortController();
//   const timeout = config.timeout ?? 5000;

//   // 🔗 Merge external abort signal
//   let abortHandler: (() => void) | undefined;

//   if (config.signal) {
//     abortHandler = () => controller.abort();
//     config.signal.addEventListener("abort", abortHandler);
//   }

//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     // ✅ Transform request data
//     let finalData = config.transformRequest
//       ? config.transformRequest(config.data)
//       : config.data;

//     const method = (config.method || "GET").toUpperCase();

//     // ✅ Only allow body for non-GET/HEAD
//     const hasBody = !["GET", "HEAD"].includes(method);

//     let body: any = undefined;

//     if (hasBody && finalData !== undefined && finalData !== null) {
//       if (
//         typeof finalData === "object" &&
//         !(finalData instanceof FormData) &&
//         !(finalData instanceof Blob)
//       ) {
//         body = JSON.stringify(finalData);
//       } else {
//         body = finalData;
//       }
//     }

//     // ✅ Perform fetch request
//     const res = await fetch(
//       buildURL(config.baseURL, config.url, config.params),
//       {
//         method,
//         headers: config.headers || {},
//         body,
//         signal: controller.signal,
//       }
//     );

//     // ✅ Handle response type
//     let data: any;

//     if (config.responseType === "text") {
//       data = await res.text();
//     } else if (config.responseType === "blob") {
//       data = await res.blob();
//     } else {
//       // default → JSON
//       const contentType = res.headers.get("content-type") || "";

//       if (contentType.includes("application/json")) {
//         data = await res.json();
//       } else if (contentType.includes("text/")) {
//         data = await res.text();
//       } else {
//         data = await res.blob();
//       }
//     }

//     // ✅ Transform response
//     if (config.transformResponse) {
//       data = config.transformResponse(data);
//     }

//     // ❌ Handle HTTP errors
//     if (!res.ok) {
//       throw new ReqnestError(
//         `HTTP Error: ${res.status}`,
//         res.status,
//         data
//       );
//     }

//     // ✅ Final response object
//     ctx.response = {
//       data,
//       status: res.status,
//       statusText: res.statusText,
//       headers: res.headers,
//       raw: res,
//     };
//   } catch (err: any) {
//     if (err.name === "AbortError") {
//       ctx.error = new ReqnestError("Request Timeout");
//     } else if (err instanceof ReqnestError) {
//       ctx.error = err;
//     } else {
//       ctx.error = new ReqnestError(err.message || "Network Error");
//     }

//     throw ctx.error;
//   } finally {
//     clearTimeout(timeoutId);

//     // ✅ Clean up abort listener (important)
//     if (config.signal && abortHandler) {
//       config.signal.removeEventListener("abort", abortHandler);
//     }
//   }

//   await next();
// };


// import { Middleware } from "../types/middleware.js";
// import { buildURL } from "../utils/buildURL.js";
// import { ReqnestError } from "../errors/ReqnestError.js";

// export const dispatch: Middleware = async (ctx, next) => {
//   const { config } = ctx;

//   const controller = new AbortController();

//   // 🔗 Merge external abort signal
//   let abortHandler: (() => void) | undefined;

//   if (config.signal) {
//     abortHandler = () => controller.abort();
//     config.signal.addEventListener("abort", abortHandler);
//   }

//   // ✅ SAFE timeout (only if valid & reasonable)
//   let timeoutId: any;

//   if (
//     typeof config.timeout === "number" &&
//     config.timeout > 50 // 🔥 prevent instant abort
//   ) {
//     timeoutId = setTimeout(() => {
//       controller.abort();
//     }, config.timeout);
//   }

//   try {
//     // 🔧 Transform request
//     const finalData = config.transformRequest
//       ? config.transformRequest(config.data)
//       : config.data;

//     const method = (config.method || "GET").toUpperCase();

//     const hasBody = !["GET", "HEAD"].includes(method);

//     let body: any = undefined;
//     let headers = { ...(config.headers || {}) };

//     if (hasBody && finalData !== undefined && finalData !== null) {
//       if (
//         typeof finalData === "object" &&
//         !(finalData instanceof FormData) &&
//         !(finalData instanceof Blob)
//       ) {
//         body = JSON.stringify(finalData);

//         // 🔥 auto JSON header
//         if (!headers["Content-Type"]) {
//           headers["Content-Type"] = "application/json";
//         }
//       } else {
//         body = finalData;
//       }
//     }

//     const url = buildURL(config.baseURL, config.url, config.params);

//     // 🌐 fetch request
//     const res = await fetch(url, {
//       method,
//       headers,
//       body,
//       signal: controller.signal,
//     });

//     // 📦 parse response
//     let data: any;
//     const contentType = res.headers.get("content-type") || "";

//     if (config.responseType === "text") {
//       data = await res.text();
//     } else if (config.responseType === "blob") {
//       data = await res.blob();
//     } else if (contentType.includes("application/json")) {
//       data = await res.json();
//     } else if (contentType.includes("text/")) {
//       data = await res.text();
//     } else {
//       data = await res.blob();
//     }

//     // 🔧 transform response
//     if (config.transformResponse) {
//       data = config.transformResponse(data);
//     }

//     // ❌ HTTP error
//     if (!res.ok) {
//       throw new ReqnestError(
//         `HTTP Error: ${res.status}`,
//         res.status,
//         data,
//         {
//           request: { url, method, headers, body },
//           response: res,
//         }
//       );
//     }

//     // ✅ success response
//     ctx.response = {
//       data,
//       status: res.status,
//       statusText: res.statusText,
//       headers: res.headers,
//       raw: res,
//     };

//   } catch (err: any) {
//     if (err.name === "AbortError") {
//       ctx.error = new ReqnestError("Request Timeout", undefined, undefined, {
//         request: config,
//       });
//     } else if (err instanceof ReqnestError) {
//       ctx.error = err;
//     } else {
//       ctx.error = new ReqnestError(
//         err.message || "Network Error",
//         undefined,
//         undefined,
//         { request: config }
//       );
//     }

//     throw ctx.error;
//   } finally {
//     // 🧹 cleanup timeout
//     if (timeoutId) clearTimeout(timeoutId);

//     // 🧹 cleanup abort listener
//     if (config.signal && abortHandler) {
//       config.signal.removeEventListener("abort", abortHandler);
//     }
//   }

//   await next();
// };



import { fetch } from "undici";
import { Middleware } from "../types/middleware.js";
import { buildURL } from "../utils/buildURL.js";
import { ReqnestError } from "../errors/ReqnestError.js";

export const dispatch: Middleware = async (ctx, next) => {
  const { config } = ctx;

  const controller = new AbortController();

  let abortHandler: (() => void) | undefined;

  if (config.signal) {
    abortHandler = () => controller.abort();
    config.signal.addEventListener("abort", abortHandler);
  }

  let timeoutId: any;

  if (typeof config.timeout === "number" && config.timeout > 50) {
    timeoutId = setTimeout(() => controller.abort(), config.timeout);
  }

  try {
    const method = (config.method || "GET").toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);

    let headers = { ...(config.headers || {}) };
    let body: any;

    const finalData = config.transformRequest
      ? config.transformRequest(config.data)
      : config.data;

    if (hasBody && finalData !== undefined && finalData !== null) {
      if (
        typeof finalData === "object" &&
        !(finalData instanceof FormData) &&
        !(finalData instanceof Blob)
      ) {
        body = JSON.stringify(finalData);

        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      } else {
        body = finalData;
      }
    }

    const url = buildURL(config.baseURL, config.url, config.params);

    const res = await fetch(url, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    //  parse response
    let data: any;
    const contentType = res.headers.get("content-type") || "";

    if (config.responseType === "text") {
      data = await res.text();
    } else if (config.responseType === "blob") {
      data = await res.blob();
    } else if (contentType.includes("application/json")) {
      data = await res.json();
    } else if (contentType.includes("text/")) {
      data = await res.text();
    } else {
      data = await res.blob();
    }

    if (config.transformResponse) {
      data = config.transformResponse(data);
    }

    if (!res.ok) {
      throw new ReqnestError(
        `HTTP Error: ${res.status}`,
        res.status,
        data,
        {
          request: { url, method, headers, body },
          response: res,
        }
      );
    }

    //  FIX: convert headers to plain object
    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    ctx.response = {
      data,
      status: res.status,
      statusText: res.statusText,
      headers: headersObj,
      raw: res,
    };

  } catch (err: any) {
    if (err.name === "AbortError") {
      ctx.error = new ReqnestError("Request Timeout", undefined, undefined, {
        request: config,
      });
    } else if (err instanceof ReqnestError) {
      ctx.error = err;
    } else {
      ctx.error = new ReqnestError(
        err.message || "Network Error",
        undefined,
        undefined,
        { request: config }
      );
    }

    throw ctx.error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);

    if (config.signal && abortHandler) {
      config.signal.removeEventListener("abort", abortHandler);
    }
  }

  await next();
};