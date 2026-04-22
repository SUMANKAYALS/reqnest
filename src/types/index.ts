export interface ReqnestRequestConfig {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    data?: any;
    baseURL?: string;
}

export interface ReqnestResponse<T = any> {
    data: T;
    status: number;
    headers: Headers;
}

export interface ReqnestContext {
    config: ReqnestRequestConfig;
    response?: ReqnestResponse;
    error?: any;
}

export type Middleware = (
    ctx: ReqnestContext,
    next: () => Promise<void>
) => Promise<void>;