import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vaultPath = path.join(__dirname, '..', 'vault.html');
const html = fs.readFileSync(vaultPath, 'utf8');

function assertIncludes(needle, message) {
  assert.ok(html.includes(needle), message);
}

function assertMatches(pattern, message) {
  assert.match(html, pattern, message);
}

assertIncludes('id="legacyApyOverlayToggle"', 'APY chart needs its own legacy overlay toggle.');
assertIncludes('<span>Legacy APY</span>', 'APY toggle label should mirror the ROI toggle label style.');
assertIncludes('let showLegacyApyOverlay = false;', 'APY overlay state should be tracked separately from ROI.');
assertIncludes(
  "const legacyApyOverlayToggle = document.getElementById('legacyApyOverlayToggle');",
  'APY toggle should be cached with the other DOM references.'
);
assertIncludes(
  'function getCalendarMatchedLegacyApySeries(labels, comparison) {',
  'Legacy APY series should use a dedicated same-date helper.'
);
assertMatches(
  /legacyApyData:\s*getCalendarMatchedLegacyApySeries\(labels,\s*comparison\)/,
  'APY chart series should include same-date legacy APY data.'
);
assertMatches(
  /const\s*\{\s*labels,\s*apyData,\s*legacyApyData\s*\}\s*=\s*getApyChartSeries\(\);/,
  'APY chart should consume both cross-platform and legacy APY data.'
);
assertMatches(
  /if\s*\(showLegacyApyOverlay\)\s*\{[\s\S]*label:\s*'Legacy APY \(same dates\)'/,
  'APY chart should add a dotted legacy APY dataset when the toggle is on.'
);
assertMatches(
  /legacyApyOverlayToggle\.addEventListener\('change',\s*\(\)\s*=>\s*\{[\s\S]*showLegacyApyOverlay\s*=\s*legacyApyOverlayToggle\.checked;[\s\S]*renderApyChart\(\);/,
  'APY toggle should re-render the APY chart when changed.'
);

console.log('vault legacy APY overlay checks passed');
