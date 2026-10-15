import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import { skills } from '../../src/config/skills';

// The API reads every icon when it starts, so one missing file would take down every card
test('every skill has an icon', () => {
    const missing = Object.keys(skills).filter((key) => !fs.existsSync(path.join(__dirname, '..', '..', 'src', 'assets', 'skills', `${key}.svg`)));
    assert.deepEqual(missing, []);
});
