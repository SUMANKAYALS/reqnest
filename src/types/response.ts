// export interface ReqnestResponse<T = any> {
//     data: T;
//     status: number;
//     statusText: string;

//     headers: Record<string, string>; //  normalized headers
//     raw: unknown;                    // no environment conflict
// }

export interface ReqnestResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>; // universal
    raw: unknown; // no conflict
}