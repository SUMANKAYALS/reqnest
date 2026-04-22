export type HTTPMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "HEAD"
    | "OPTIONS";

export interface ReqnestRequestConfig<T = any> {
    url: string;

    method?: HTTPMethod;
    baseURL?: string;

    headers?: Record<string, string>;

    // request body
    data?: T;

    // query params
    params?: Record<string, any>;

    // timeout (ms)
    timeout?: number;

    // cancellation
    signal?: AbortSignal;

    // transformers
    transformRequest?: (data: T) => any;
    transformResponse?: (data: any) => any;

    // plugin controls
    retry?: number;
    cache?: boolean;

    // response handling
    responseType?: "json" | "text" | "blob";

    // metadata (internal/debugging)
    meta?: Record<string, any>;
}