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

assertIncludes(
  "const USDC_ASTER_SERIES = '3x JLP (borrow USDC) + Aster Funding';",
  'Dashboard should target the exact PrimeNumber USDC-borrow Aster series.'
);
assertIncludes('JLP 3x USDC Borrow + Aster Funding', 'Dashboard should label the new USDC-borrow Aster chart.');
assertIncludes('id="usdcAsterChart"', 'Dashboard should render a separate canvas for the USDC-borrow chart.');
assertIncludes('id="usdcAsterChartCaption"', 'Dashboard should render a caption for the USDC-borrow chart.');
assertIncludes('data-usdc-aster-period="all"', 'Dashboard should provide period controls for the USDC-borrow chart.');
assertIncludes('let usdcAsterChartInstance = null;', 'USDC-borrow chart should track its Chart.js instance.');
assertIncludes('let activeUsdcAsterPeriod = \'all\';', 'USDC-borrow chart should track the active period.');
assertMatches(
  /function\s+parseTargetSummary\(html,\s*seriesName\s*=\s*TARGET_SERIES\)/,
  'Summary parser should support more than the primary SOL-borrow series.'
);
assertMatches(
  /extractReportSeriesPoints\(option,\s*labels,\s*USDC_ASTER_SERIES\)/,
  'Report parser should extract the USDC-borrow Aster data series from the source chart.'
);
assertIncludes('usdcAster:', 'Parsed report data should include a usdcAster object.');
assertIncludes('function getUsdcAsterChartSeries()', 'Dashboard should build chart data for the USDC-borrow series.');
assertIncludes('function renderUsdcAsterChart()', 'Dashboard should render the USDC-borrow chart.');
assertMatches(
  /renderDashboard\(\)\s*\{[\s\S]*renderUsdcAsterChart\(\);/,
  'Dashboard render flow should include the USDC-borrow chart.'
);
assertMatches(
  /document\.querySelectorAll\('\[data-usdc-aster-period\]'\)\.forEach/,
  'USDC-borrow period controls should be wired to re-render the chart.'
);

console.log('vault USDC Aster chart checks passed');
