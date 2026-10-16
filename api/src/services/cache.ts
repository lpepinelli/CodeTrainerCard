// Promises are stored so concurrent requests for the same key share one load; failed loads are dropped so they can be retried
export const cacheFor = <T>(ttlMs: number, load: (key: string) => Promise<T>) => {
    const entries = new Map<string, { expires: number; value: Promise<T> }>();
    const has = (key: string) => (entries.get(key)?.expires ?? 0) > Date.now();

    const get = (key: string) => {
        if (has(key)) return entries.get(key)!.value;

        const now = Date.now();
        entries.forEach((cached, cachedKey) => cached.expires <= now && entries.delete(cachedKey));
        const value = load(key);
        entries.set(key, { expires: now + ttlMs, value });
        value.catch(() => entries.get(key)?.value === value && entries.delete(key));
        return value;
    };

    return Object.assign(get, { has });
}
