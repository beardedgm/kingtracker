const assert = require('assert');
const { KingdomService, AVAILABLE_STRUCTURES } = require('../script');

function createSettlement(gridSize, lots) {
  return { gridSize, lots };
}

// Helper to create empty lot
function emptyLot() {
  return { buildingId: null, isOrigin: false, structureName: null };
}

function lotWith(structureName) {
  return { buildingId: 1, isOrigin: true, structureName };
}

function testOvercrowding() {
  const houses = 'Houses'; // residential
  const mill = 'Mill'; // non-residential

  // Settlement with houses only in first lot
  let settlement = createSettlement(6, Array(36).fill().map(() => emptyLot()));
  settlement.lots[0] = lotWith(houses);
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), false, 'single residential covers first block');

  // Add a non-residential structure in a different row
  settlement.lots[6] = lotWith(mill);
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), true, 'non-residential in new block causes overcrowding');

  // Add another residential structure to cover second block
  settlement.lots[6] = lotWith(houses);
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), false, 'adding residential resolves overcrowding');
}

try {
  testOvercrowding();
  console.log('All tests passed.');
} catch (err) {
  console.error('Test failed:', err.message);
  process.exitCode = 1;
}
