// export class ReqnestError extends Error {
//     status?: number;
//     data?: any;
//     request?: any;
//     response?: any;

//     constructor(
//         message: string,
//         status?: number,
//         data?: any,
//         meta?: {
//             request?: any;
//             response?: any;
//         }
//     ) {
//         super(message);

//         this.name = "ReqnestError";
//         this.status = status;
//         this.data = data;

//         if (meta) {
//             this.request = meta.request;
//             this.response = meta.response;
//         }
//     }
// }

export class ReqnestError extends Error {
    status?: number;
    data?: any;
    request?: any;
    response?: any;

    constructor(
        message: string,
        status?: number,
        data?: any,
        meta?: {
            request?: any;
            response?: any;
        }
    ) {
        super(message);

        this.name = "ReqnestError";
        this.status = status;
        this.data = data;

        if (meta) {
            this.request = meta.request;
            this.response = meta.response;
        }
    }
}