export function mergeConfig(a: any, b: any) {
    return {
        ...a,
        ...b,
        headers: {
            ...(a.headers || {}),
            ...(b.headers || {}),
        },
    };
}