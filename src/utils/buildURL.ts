export function buildURL(
    baseURL?: string,
    url?: string,
    params?: Record<string, any>
): string {
    let fullURL = "";

    // ✅ Safe URL join
    if (baseURL && url) {
        fullURL =
            baseURL.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "");
    } else {
        fullURL = baseURL || url || "";
    }

    // ✅ Add query params
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (Array.isArray(value)) {
                value.forEach((v) => searchParams.append(key, String(v)));
            } else {
                searchParams.append(key, String(value));
            }
        });

        const query = searchParams.toString();

        if (query) {
            fullURL += (fullURL.includes("?") ? "&" : "?") + query;
        }
    }

    return fullURL;
}