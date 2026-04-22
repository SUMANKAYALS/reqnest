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