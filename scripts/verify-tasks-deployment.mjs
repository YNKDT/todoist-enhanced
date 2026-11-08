import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = 'https://tasks.yannik-dittmann.workers.dev/';
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const config = await read('wrangler.jsonc');
assert.match(config, /"name"\s*:\s*"tasks"/, 'Worker name must be tasks');
const headers = await read('dist/_headers');
assert.match(headers, /X-Robots-Tag:\s*noindex, nofollow/i);
assert.match(await read('public/.assetsignore'), /^\.htaccess\s*$/m);
const localClient = await read('dist/oauth/client.json');
const client = JSON.parse(localClient);
assert.equal(client.client_id, `${base}oauth/client.json`);
assert.equal(client.client_uri, base);
assert.ok(client.redirect_uris.includes(base), 'Missing production redirect URI');
assert.ok(!process.argv.slice(2).some((arg) => arg !== '--live'), 'Unknown argument');

if (process.argv.includes('--live')) {
  for (const [path, local] of [['', await read('dist/index.html')], ['oauth/client.json', localClient]]) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Unexpected status for /${path}`);
    assert.equal(await response.text(), local, `Deployed /${path} differs from build`);
    for (const name of ['content-security-policy', 'permissions-policy', 'referrer-policy', 'x-content-type-options', 'x-robots-tag']) {
      const expected = headers.match(new RegExp(`^\\s*${name}:\\s*(.+)$`, 'im'));
      assert.ok(expected, `Missing local ${name}`);
      assert.equal(response.headers.get(name), expected[1].trim(), `Unexpected ${name} for /${path}`);
    }
  }
}
console.log(process.argv.includes('--live') ? 'Local configuration and live deployment verified.' : 'Local configuration and OAuth metadata verified.');
