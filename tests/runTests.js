const assert = require('assert');
// Import internal services and helpers from the main script
const {
  KingdomService,
  AVAILABLE_STRUCTURES,
  TurnService,
  SettlementService,
  getKingdom,
  setKingdom,
  setTurnData,
  getTurnData
} = require('../script');

// Provide very small stubs for browser dependent globals used by the services
global.UIkit = { notification: () => {}, modal: { confirm: () => Promise.resolve({}), alert: () => Promise.resolve({}) } };
global.UI = { renderTurnTracker: () => {}, renderAll: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

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

// ----- new tests for attempt limits -----
function setupBasicKingdom(level, structures = []) {
  const lots = structures.map(name => ({ buildingId: 1, isOrigin: true, structureName: name }));
  setKingdom({
    level,
    size: 1,
    fame: 0,
    unrest: 0,
    food: 10,
    armies: [],
    farmlandHexes: 0,
    leaders: {},
    capital: 'Cap',
    settlements: [{ name: 'Cap', gridSize: 1, lots }]
  });
}

function testCanAttemptClaimHex() {
  setupBasicKingdom(1);
  setTurnData({ claimHexAttempts: 0 });
  assert.strictEqual(TurnService.canAttemptClaimHex(), true, 'level 1 start');

  setTurnData({ claimHexAttempts: 1 });
  assert.strictEqual(TurnService.canAttemptClaimHex(), false, 'level 1 max 1 attempt');

  setupBasicKingdom(8);
  setTurnData({ claimHexAttempts: 1 });
  assert.strictEqual(TurnService.canAttemptClaimHex(), true, 'level 8 allows two');

  setTurnData({ claimHexAttempts: 2 });
  assert.strictEqual(TurnService.canAttemptClaimHex(), false, 'level 8 after two attempts');
}

function testCanAttemptLeadershipActivity() {
  // level below threshold with no special buildings
  setupBasicKingdom(5);
  setTurnData({ leadershipActivitiesUsed: 1 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), true, 'level 5 base allows 2');

  setTurnData({ leadershipActivitiesUsed: 2 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), false, 'level 5 after two');

  // higher level increases base
  setupBasicKingdom(12);
  setTurnData({ leadershipActivitiesUsed: 2 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), true, 'level 12 base 3');

  setTurnData({ leadershipActivitiesUsed: 3 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), false, 'level 12 after three');

  // Town Hall in capital grants +1
  setupBasicKingdom(12, ['Town Hall']);
  setTurnData({ leadershipActivitiesUsed: 3 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), true, 'Town Hall allows extra');

  setTurnData({ leadershipActivitiesUsed: 4 });
  assert.strictEqual(TurnService.canAttemptLeadershipActivity(), false, 'Town Hall max reached');
}

function testPhaseOrder() {
  setupBasicKingdom(1);
  setTurnData({
    rolledResources: false,
    paidConsumption: false,
    appliedUnrest: false,
    eventChecked: false,
    claimHexAttempts: 0,
    leadershipActivitiesUsed: 0,
    regionActivitiesUsed: 0,
    civicActivitiesUsed: 0,
    turnResourcePoints: 0,
    turnUnrest: 0
  });

  // cannot pay consumption before rolling resources
  TurnService.payConsumption();
  assert.strictEqual(getTurnData().paidConsumption, false, 'payConsumption blocked');

  // cannot apply upkeep before paying consumption
  TurnService.applyUpkeepEffects();
  assert.strictEqual(getTurnData().appliedUnrest, false, 'applyUpkeepEffects blocked');

  // cannot check event before applying unrest
  TurnService.checkForEvent();
  assert.strictEqual(getTurnData().eventChecked, false, 'checkForEvent blocked');
}

function setupInfrastructureKingdom() {
  setKingdom({
    level: 1,
    size: 1,
    fame: 0,
    unrest: 0,
    food: 10,
    treasury: 50,
    stone: 10,
    lumber: 0,
    luxuries: 0,
    ore: 0,
    armies: [],
    farmlandHexes: 0,
    leaders: {},
    capital: 'Cap',
    settlements: [{
      id: 1,
      name: 'Cap',
      gridSize: 1,
      lots: [emptyLot()],
      infrastructure: {
        sewerSystem: false,
        pavedStreets: false,
        magicalStreetlamps: false
      }
    }]
  });
}

function testInfrastructurePlacement() {
  setupInfrastructureKingdom();
  const settlement = getKingdom().settlements[0];
  const beforeLots = JSON.parse(JSON.stringify(settlement.lots));
  SettlementService.placeStructure(1, 0, 'Paved Streets');
  assert.strictEqual(settlement.infrastructure.pavedStreets, true, 'paved streets flag set');
  assert.deepStrictEqual(settlement.lots, beforeLots, 'lots remain unchanged');
}

try {
  testOvercrowding();
  testCanAttemptClaimHex();
  testCanAttemptLeadershipActivity();
  testPhaseOrder();
  testInfrastructurePlacement();
  console.log('All tests passed.');
} catch (err) {
  console.error('Test failed:', err);
  process.exitCode = 1;
}
