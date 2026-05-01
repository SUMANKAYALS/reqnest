// import { Middleware } from "../types/middleware.js";
// import { buildURL } from "../utils/buildURL.js";
// import { ReqnestError } from "../errors/ReqnestError.js";

// type HeadersObject = Record<string, string>;

// export const dispatch: Middleware = async (ctx, next) => {
//   const { config } = ctx;

//   const controller = new AbortController();

//   let abortHandler: (() => void) | undefined;

//   // 🔗 External abort support
//   if (config.signal) {
//     abortHandler = () => controller.abort();
//     config.signal.addEventListener("abort", abortHandler);
//   }

//   // ⏱ Timeout handling
//   let timeoutId: ReturnType<typeof setTimeout> | undefined;
//   if (typeof config.timeout === "number" && config.timeout > 50) {
//     timeoutId = setTimeout(() => controller.abort(), config.timeout);
//   }

//   try {
//     const method = (config.method || "GET").toUpperCase();
//     const hasBody = !["GET", "HEAD"].includes(method);

//     const headers: Record<string, string> = {
//       ...(config.headers || {}),
//     };

//     let body: BodyInit | undefined;

//     const finalData = config.transformRequest
//       ? config.transformRequest(config.data)
//       : config.data;

//     // 📦 Body handling
//     if (hasBody && finalData !== undefined && finalData !== null) {
//       if (
//         typeof finalData === "object" &&
//         !(finalData instanceof FormData) &&
//         !(finalData instanceof Blob)
//       ) {
//         body = JSON.stringify(finalData);

//         if (!headers["Content-Type"]) {
//           headers["Content-Type"] = "application/json";
//         }
//       } else {
//         body = finalData as BodyInit;
//       }
//     }

//     const url = buildURL(config.baseURL, config.url, config.params);

//     // 🌐 Universal fetch (Browser + Node 18+)
//     const res = await globalThis.fetch(url, {
//       method,
//       headers,
//       body,
//       signal: controller.signal,
//     });

//     // 📥 Response parsing
//     let data: unknown;
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

//     // 🔄 Transform response
//     if (config.transformResponse) {
//       data = config.transformResponse(data);
//     }

//     // ❌ HTTP error handling
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

//     // 📌 Convert Headers → plain object
//     const headersObj: HeadersObject = {};
//     res.headers.forEach((value, key) => {
//       headersObj[key] = value;
//     });

//     // ✅ Final response
//     ctx.response = {
//       data,
//       status: res.status,
//       statusText: res.statusText,
//       headers: headersObj,
//       raw: res,
//     };

//   } catch (err: unknown) {
//     let error: ReqnestError;

//     if (err instanceof ReqnestError) {
//       error = err;
//     } else if (err instanceof Error && err.name === "AbortError") {
//       error = new ReqnestError(
//         "Request Timeout",
//         undefined,
//         undefined,
//         { request: config }
//       );
//     } else if (err instanceof Error) {
//       error = new ReqnestError(
//         err.message || "Network Error",
//         undefined,
//         undefined,
//         { request: config }
//       );
//     } else {
//       error = new ReqnestError(
//         "Unknown Error",
//         undefined,
//         undefined,
//         { request: config }
//       );
//     }

//     ctx.error = error;
//     throw error;

//   } finally {
//     if (timeoutId) clearTimeout(timeoutId);

//     if (config.signal && abortHandler) {
//       config.signal.removeEventListener("abort", abortHandler);
//     }
//   }

//   await next();
// };




import { Middleware } from "../types/middleware.js";

import { buildURL } from "../utils/buildURL.js";

import { ReqnestError } from "../errors/ReqnestError.js";

type HeadersObject =
  Record<string, string>;

export const dispatch:
  Middleware =
  async (ctx) => {

    const { config } =
      ctx;

    const controller =
      new AbortController();

    let abortHandler:
      (() => void) |
      undefined;

    /*
    |--------------------------------------------------------------------------
    | External Abort Support
    |--------------------------------------------------------------------------
    */

    if (config.signal) {

      abortHandler =
        () => controller.abort();

      config.signal.addEventListener(
        "abort",
        abortHandler
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Timeout Handling
    |--------------------------------------------------------------------------
    */

    let timeoutId:
      ReturnType<typeof setTimeout> |
      undefined;

    if (
      typeof config.timeout ===
      "number" &&
      config.timeout > 50
    ) {

      timeoutId =
        setTimeout(
          () => controller.abort(),
          config.timeout
        );
    }

    try {

      const method =
        (
          config.method ||
          "GET"
        ).toUpperCase();

      const hasBody =
        ![
          "GET",
          "HEAD",
        ].includes(method);

      /*
      |--------------------------------------------------------------------------
      | Headers
      |--------------------------------------------------------------------------
      */

      const headers:
        Record<string, string> = {
        ...(config.headers || {}),
      };

      let body:
        BodyInit |
        undefined;

      const finalData =
        config.transformRequest
          ? config.transformRequest(
            config.data
          )
          : config.data;

      /*
      |--------------------------------------------------------------------------
      | Body Handling
      |--------------------------------------------------------------------------
      */

      if (
        hasBody &&
        finalData !== undefined &&
        finalData !== null
      ) {

        if (
          typeof finalData ===
          "object" &&
          !(
            finalData instanceof
            FormData
          ) &&
          !(
            finalData instanceof
            Blob
          )
        ) {

          body =
            JSON.stringify(
              finalData
            );

          if (
            !headers[
            "Content-Type"
            ]
          ) {

            headers[
              "Content-Type"
            ] =
              "application/json";
          }

        } else {

          body =
            finalData as BodyInit;
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Build URL
      |--------------------------------------------------------------------------
      */

      const url =
        buildURL(
          config.baseURL,
          config.url,
          config.params
        );

      /*
      |--------------------------------------------------------------------------
      | Fetch Request
      |--------------------------------------------------------------------------
      */

      const res =
        await globalThis.fetch(
          url,
          {
            method,

            headers,

            body,

            signal:
              controller.signal,
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Response Parsing
      |--------------------------------------------------------------------------
      */

      let data:
        unknown;

      const contentType =
        res.headers.get(
          "content-type"
        ) || "";

      if (
        config.responseType ===
        "text"
      ) {

        data =
          await res.text();

      } else if (
        config.responseType ===
        "blob"
      ) {

        data =
          await res.blob();

      } else if (
        contentType.includes(
          "application/json"
        )
      ) {

        data =
          await res.json();

      } else if (
        contentType.includes(
          "text/"
        )
      ) {

        data =
          await res.text();

      } else {

        data =
          await res.blob();
      }

      /*
      |--------------------------------------------------------------------------
      | Transform Response
      |--------------------------------------------------------------------------
      */

      if (
        config.transformResponse
      ) {

        data =
          config.transformResponse(
            data
          );
      }

      /*
      |--------------------------------------------------------------------------
      | HTTP Error Handling
      |--------------------------------------------------------------------------
      */

      if (!res.ok) {

        throw new ReqnestError(
          `HTTP Error: ${res.status}`,

          res.status,

          data,

          {
            request: {
              url,
              method,
              headers,
              body,
            },

            response:
              res,
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Convert Headers
      |--------------------------------------------------------------------------
      */

      const headersObj:
        HeadersObject = {};

      res.headers.forEach(
        (
          value,
          key
        ) => {

          headersObj[
            key
          ] = value;
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Final Response
      |--------------------------------------------------------------------------
      */

      ctx.response = {
        data,

        status:
          res.status,

        statusText:
          res.statusText,

        headers:
          headersObj,

        raw:
          res,
      };

    } catch (
    err: unknown
    ) {

      let error:
        ReqnestError;

      if (
        err instanceof
        ReqnestError
      ) {

        error = err;

      } else if (
        err instanceof Error &&
        err.name ===
        "AbortError"
      ) {

        error =
          new ReqnestError(
            "Request Timeout",

            undefined,

            undefined,

            {
              request:
                config,
            }
          );

      } else if (
        err instanceof Error
      ) {

        error =
          new ReqnestError(
            err.message ||
            "Network Error",

            undefined,

            undefined,

            {
              request:
                config,
            }
          );

      } else {

        error =
          new ReqnestError(
            "Unknown Error",

            undefined,

            undefined,

            {
              request:
                config,
            }
          );
      }

      ctx.error =
        error;

      throw error;

    } finally {

      if (timeoutId) {

        clearTimeout(
          timeoutId
        );
      }

      if (
        config.signal &&
        abortHandler
      ) {

        config.signal.removeEventListener(
          "abort",
          abortHandler
        );
      }
    }
  };