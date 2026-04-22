import { ReqnestRequestConfig } from "./request.js";
import { ReqnestResponse } from "./response.js";

export interface ReqnestContext<T = any> {
    config: ReqnestRequestConfig<T>;
    response?: ReqnestResponse<T>;
    error?: unknown;
}