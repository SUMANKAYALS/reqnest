// export function mergeConfig(a: any, b: any) {
//     return {
//         ...a,
//         ...b,
//         headers: {
//             ...(a.headers || {}),
//             ...(b.headers || {}),
//         },
//     };
// }


export function mergeConfig(
    a: any = {},
    b: any = {}
) {

    return {
        ...a,

        ...b,

        headers: {
            ...(a.headers || {}),

            ...(b.headers || {}),
        },

        params: {
            ...(a.params || {}),

            ...(b.params || {}),
        },
    };
}