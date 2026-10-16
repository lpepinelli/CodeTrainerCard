import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

import { cacheFor } from '../../src/services/cache';

const counter = () => {
    const calls: string[] = [];
    return { calls, load: async (key: string) => { calls.push(key); return `${key}-${calls.length}`; } };
}

test('repeated keys within the TTL reuse the first load', async () => {
    const { calls, load } = counter();
    const cached = cacheFor(1000, load);
    assert.equal(await cached('octocat'), 'octocat-1');
    assert.equal(await cached('octocat'), 'octocat-1');
    assert.equal(await cached('mona'), 'mona-2');
    assert.deepEqual(calls, ['octocat', 'mona']);
});

test('concurrent requests share one load', async () => {
    const { calls, load } = counter();
    const cached = cacheFor(1000, load);
    await Promise.all([cached('octocat'), cached('octocat')]);
    assert.equal(calls.length, 1);
});

test('entries reload after the TTL', async (t) => {
    t.mock.timers.enable({ apis: ['Date'] });
    const { load } = counter();
    const cached = cacheFor(1000, load);
    await cached('octocat');
    t.mock.timers.tick(1001);
    assert.equal(await cached('octocat'), 'octocat-2');
});

test('has reports whether a key would be served from the cache', async (t) => {
    t.mock.timers.enable({ apis: ['Date'] });
    const { load } = counter();
    const cached = cacheFor(1000, load);
    assert.equal(cached.has('octocat'), false);
    await cached('octocat');
    assert.equal(cached.has('octocat'), true);
    t.mock.timers.tick(1001);
    assert.equal(cached.has('octocat'), false);
});

test('failed loads are not cached', async () => {
    const load = mock.fn(async () => {
        if (load.mock.callCount() === 0) throw new Error('GitHub is down');
        return 'profile';
    });
    const cached = cacheFor(1000, load);
    await assert.rejects(cached('octocat'));
    assert.equal(await cached('octocat'), 'profile');
});
