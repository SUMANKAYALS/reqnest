import { ReqnestContext } from "./context.js";

export type Next = () => Promise<void>;

export type Middleware<T = any> = (
    ctx: ReqnestContext<T>,
    next: Next
) => Promise<void>;