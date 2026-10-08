export function getUrlParams(
    paramMappings: Record<string, any>,
    url: string
): string {
    const params = new URLSearchParams();

    Object.entries(paramMappings).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else if (value != null && value !== "") {
            params.append(key, value);
        }
    });

    if (params.size > 0) {
        return `${url}?${params.toString()}`;
    }

    return url
}