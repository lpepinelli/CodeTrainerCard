import assert from 'node:assert/strict';
import { test } from 'node:test';

import { composeCard } from '../../src/card/composeCard';
import type { CardSource } from '../../src/card/composeCard';

const source: CardSource = {
    id: 43144939,
    login: 'octocat',
    name: 'Mona',
    createdAt: '2018-09-10T15:32:25Z',
    avatar: 'avatar',
    followers: 15,
    commits: 200,
    privateContributions: 8,
    pullRequests: 70,
    languages: ['Go', 'TypeScript', 'Brainfuck', 'Rust'],
    badges: ['badge-a', 'badge-b'],
};

const pixelated: string[] = [];
const runtime = {
    font: 'data:font/ttf;base64,AAAA',
    skillIcon: (key: string) => `icon-${key}`,
    pixelate: async (image: string, size: number) => {
        pixelated.push(`${image}@${size}`);
        return `${image}@${size}`;
    },
};

test('profile data and defaults fill the card', async () => {
    const card = await composeCard(source, {}, runtime);
    assert.match(card, /NAME: MONA/);
    assert.match(card, />200</);
    assert.match(card, /IDNo\.44939/);
    assert.match(card, /fill="#BC93FF"/);
});

test('skills default to the top GitHub languages that have an icon', async () => {
    const card = await composeCard(source, {}, runtime);
    const icons = card.match(/icon-[a-z]+/g);
    assert.deepEqual(icons, ['icon-go', 'icon-ts', 'icon-rust']);
});

test('SQL dialects share one skill, and PL/pgSQL picks postgres', async () => {
    const card = await composeCard({ ...source, languages: ['TSQL', 'PLSQL', 'PLpgSQL', 'Objective-C'] }, {}, runtime);
    assert.deepEqual(card.match(/icon-[a-z]+/g), ['icon-sql', 'icon-postgres', 'icon-objectivec']);
});

test('Visual Basic flavors share one skill, and Pascal and TeX pick delphi and latex', async () => {
    const card = await composeCard({ ...source, languages: ['VBA', 'Visual Basic .NET', 'Pascal', 'TeX'] }, {}, runtime);
    assert.deepEqual(card.match(/icon-[a-z]+/g), ['icon-visualbasic', 'icon-delphi', 'icon-latex']);
});

test('requested skills replace languages, skipping unknown keys and capping at four', async () => {
    const card = await composeCard(source, { skills: 'react,nope,react,vue,go,ts,rust' }, runtime);
    assert.deepEqual(card.match(/icon-[a-z]+/g), ['icon-react', 'icon-vue', 'icon-go', 'icon-ts']);
});

test('private adds private contributions to commits', async () => {
    const card = await composeCard(source, { private: '' }, runtime);
    assert.match(card, />208</);
});

test('pixelate shrinks icons in proportion to the avatar', async () => {
    pixelated.length = 0;
    await composeCard(source, { pixelate: '', skills: 'go' }, runtime);
    assert.deepEqual(pixelated, ['avatar@80', 'badge-a@22', 'badge-b@22', 'icon-go@18']);
});

test('out of range values fall back to the defaults', async () => {
    pixelated.length = 0;
    const card = await composeCard(source, { pixelate: '999', color: 'red', 'auto-flip': '1' }, runtime);
    assert.deepEqual(pixelated, []);
    assert.match(card, /fill="#BC93FF"/);
    assert.doesNotMatch(card, /class="back"/);
});

test('hide-badges drops the badge row and makes room for eight skills', async () => {
    const card = await composeCard(source, { 'hide-badges': '', skills: 'ts,js,go,rust,c,cpp,java,php,ruby' }, runtime);
    assert.doesNotMatch(card, /BADGES/);
    assert.doesNotMatch(card, /badge-a/);
    assert.deepEqual(card.match(/icon-[a-z]+/g), ['icon-ts', 'icon-js', 'icon-go', 'icon-rust', 'icon-c', 'icon-cpp', 'icon-java', 'icon-php']);
});

test('a pixelated avatar is clipped along the photo pixel grid', async () => {
    const card = await composeCard(source, { pixelate: '32' }, runtime);
    const clip = card.match(/<clipPath id="avatar">\s*<path d="([^"]*)"/)?.[1] ?? '';
    const block = 247 / 32;
    const xs = [...clip.matchAll(/[MH](-?[\d.]+)/g)].map(([, x]) => (Number(x) - 700) / block);
    assert.ok(xs.length > 0);
    xs.forEach((x) => assert.ok(Math.abs(x - Math.round(x)) < 0.01, `edge at ${x} blocks is off the photo grid`));
});
