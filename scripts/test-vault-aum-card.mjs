import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vaultPath = path.join(__dirname, '..', 'vault.html');
const historyPath = path.join(__dirname, '..', 'data', 'voltr-cross-platform-share-history.json');
const html = fs.readFileSync(vaultPath, 'utf8');
const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const latest = history.snapshots.at(-1);

function assertIncludes(needle, message) {
  assert.ok(html.includes(needle), message);
}

function assertMatches(pattern, message) {
  assert.match(html, pattern, message);
}

assert.equal(history.vault, 'BbhQpnex9btpNqzYgL3REpTPZsAeJ3VGYtV1mmLhQ7oc', 'AUM feed should target the requested Voltr vault.');
assert.ok(Number.isFinite(latest?.totalValueUsdc), 'Latest Voltr snapshot should include numeric totalValueUsdc.');
assertIncludes(
  "const VOLTR_VALUATION_URL = 'https://vault.primenumber.trade/api/pn-dashboard/valuation?product_name=PN_JLP_PROV1';",
  'Dashboard should target the live Voltr valuation endpoint.'
);
assertIncludes('const AUM_REFRESH_INTERVAL_MS = 60000;', 'Dashboard should poll live AUM every minute.');
assertIncludes('fetchVoltrLiveValuation()', 'Dashboard should fetch live Voltr valuation data.');
assertIncludes("fetchVoltrShareHistory()", 'Dashboard should fetch the Voltr share-history feed.');
assertIncludes('formatCurrencyCompact', 'Dashboard should have a compact currency formatter for AUM.');
assertIncludes('Current AUM', 'Dashboard should render a Current AUM metric card.');
assertIncludes('totalValueUsdc', 'AUM should be sourced from totalValueUsdc.');
assertIncludes('chainNavUsd', 'Live AUM should prefer valuation.chainNavUsd.');
assertIncludes('startAumRealtimeUpdates()', 'Dashboard should start real-time AUM refreshes after initial load.');
assertMatches(
  /const\s+\[html,\s*stamp,\s*initialAumData\]\s*=\s*await\s+Promise\.all\(/,
  'Dashboard should load initial AUM data alongside performance data.'
);
assertMatches(
  /voltrData\s*=\s*initialAumData;/,
  'Dashboard should render from live AUM data when available.'
);
assertMatches(
  /<div class="metric-label">\s*Current AUM\s*<span class="info-tip"[\s\S]*live Voltr valuation/,
  'Current AUM card should explain that it comes from live Voltr valuation data.'
);

console.log('vault AUM card checks passed');
