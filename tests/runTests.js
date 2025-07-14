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
global.UIkit = {
  notification: () => {},
  modal: {
    confirm: () => ({ then: (cb) => { cb(); return Promise.resolve(); } }),
    alert: () => Promise.resolve({})
  }
};
global.UI = { renderTurnTracker: () => {}, renderAll: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {} };
// No DOM in test environment

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

// New helper to calculate how many 3x3 blocks have at least one structure
function countBuiltBlocks(settlement) {
  const blocks = new Set();
  settlement.lots.forEach((lot, idx) => {
    if (!lot.structureName) return;
    const x = idx % settlement.gridSize;
    const y = Math.floor(idx / settlement.gridSize);
    const blockIndex = Math.floor(x / 3) + Math.floor(y / 3) * (settlement.gridSize / 3);
    blocks.add(blockIndex);
  });
  return blocks.size;
}

function testOvercrowding() {
  const houses = 'Houses'; // residential
  const mill = 'Mill'; // non-residential

  // Settlement with houses only in first lot
  let settlement = createSettlement(6, Array(36).fill().map(() => emptyLot()));
  settlement.lots[0] = lotWith(houses);
  assert.strictEqual(countBuiltBlocks(settlement), 1, 'one block built');
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), false, 'single residential covers first block');

  // Add a non-residential structure in a different block
  settlement.lots[18] = lotWith(mill);
  assert.strictEqual(countBuiltBlocks(settlement), 2, 'two blocks built');
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), true, 'non-residential in new block causes overcrowding');

  // Add another residential structure to cover second block
  settlement.lots[18] = lotWith(houses);
  assert.strictEqual(countBuiltBlocks(settlement), 2, 'still two blocks built');
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), false, 'adding residential resolves overcrowding');

  // Repeat with a 9x9 settlement to verify block counting
  settlement = createSettlement(9, Array(81).fill().map(() => emptyLot()));
  settlement.lots[0] = lotWith(houses);
  assert.strictEqual(countBuiltBlocks(settlement), 1, '9x9 single block');
  settlement.lots[40] = lotWith(mill); // different block
  assert.strictEqual(countBuiltBlocks(settlement), 2, '9x9 two blocks');
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), true, 'overcrowded until second house placed');
  settlement.lots[40] = lotWith(houses);
  assert.strictEqual(KingdomService.isSettlementOvercrowded(settlement), false, 'resolved on 9x9');
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
    farmlandHexes: [],
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

function testPhaseProgression() {
  setupBasicKingdom(1);
  setTurnData({
    currentPhase: 'upkeep',
    currentStep: 1,
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
  assert.strictEqual(getTurnData().currentPhase, 'upkeep');
  assert.strictEqual(getTurnData().currentStep, 1);

  TurnService.rollResources();
  assert.strictEqual(getTurnData().currentStep, 2);

  TurnService.payConsumption();
  assert.strictEqual(getTurnData().currentStep, 3);

  TurnService.applyUpkeepEffects();
  assert.strictEqual(getTurnData().currentPhase, 'activity');
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
    farmlandHexes: [],
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

function setupKingdomWithSettlement(settlement) {
  setKingdom({
    level: 1,
    size: 1,
    fame: 0,
    unrest: 0,
    food: 0,
    armies: [],
    farmlandHexes: [],
    leaders: {},
    capital: settlement.name || 'Cap',
    settlements: [settlement]
  });
  setTurnData({ turnConsumptionModifier: 0 });
}

function testInfrastructurePlacement() {
  setupInfrastructureKingdom();
  const settlement = getKingdom().settlements[0];
  const beforeLots = JSON.parse(JSON.stringify(settlement.lots));
  SettlementService.placeStructure(1, 0, 'Paved Streets');
  assert.strictEqual(settlement.infrastructure.pavedStreets, true, 'paved streets flag set');
  assert.deepStrictEqual(settlement.lots, beforeLots, 'lots remain unchanged');
}

function testCanUpgradeSettlement() {
  const houses = 'Houses';
  const mill = 'Mill';

  // --- Town upgrade allowed ---
  let lots = Array(81).fill().map(() => emptyLot());
  const townHouseIndices = [0, 3, 27, 30];
  townHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  let settlement = createSettlement(9, lots);
  assert.strictEqual(countBuiltBlocks(settlement), 4, '9x9 town has four blocks');
  setupBasicKingdom(3);
  getKingdom().settlements[0] = settlement;
  assert.strictEqual(KingdomService.canUpgradeSettlement(settlement, 'town'), true, 'town upgrade allowed');

  // --- Town upgrade blocked by overcrowding ---
  settlement.lots[6] = lotWith(mill);
  assert.strictEqual(countBuiltBlocks(settlement), 5, 'mill adds fifth block');
  assert.strictEqual(KingdomService.canUpgradeSettlement(settlement, 'town'), false, 'town upgrade blocked when overcrowded');

  // --- City upgrade allowed ---
  lots = Array(81).fill().map(() => emptyLot());
  const cityHouseIndices = [0, 3, 6, 27, 30, 33, 54, 57, 60];
  cityHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  settlement = createSettlement(9, lots);
  assert.strictEqual(countBuiltBlocks(settlement), 9, 'city has nine blocks');
  setupBasicKingdom(8);
  getKingdom().settlements[0] = settlement;
  assert.strictEqual(KingdomService.canUpgradeSettlement(settlement, 'city'), true, 'city upgrade allowed');

  // --- Metropolis upgrade blocked by level ---
  lots = Array(144).fill().map(() => emptyLot());
  const metroHouseIndices = [0, 3, 6, 9, 36, 39, 42, 45, 72, 75];
  metroHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  settlement = createSettlement(12, lots);
  assert.strictEqual(countBuiltBlocks(settlement), 10, 'metropolis has ten blocks');
  setupBasicKingdom(14);
  getKingdom().settlements[0] = settlement;
  assert.strictEqual(KingdomService.canUpgradeSettlement(settlement, 'metropolis'), false, 'metropolis requires higher level');
}

function testConsumption() {
  const houses = 'Houses';
  let lots = Array(36).fill().map(() => emptyLot());
  const townHouseIndices = [0, 3, 18, 21];
  townHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  let settlement = createSettlement(6, lots);
  setupKingdomWithSettlement({ name: 'Town6', gridSize: 6, lots });
  assert.strictEqual(countBuiltBlocks(settlement), 4, '6x6 settlement has four blocks');
  assert.strictEqual(KingdomService.calculateConsumption().food, 2, 'town consumption');

  lots = Array(81).fill().map(() => emptyLot());
  const cityHouseIndices = [0, 3, 6, 27, 30, 33, 54, 57, 60];
  cityHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  settlement = createSettlement(9, lots);
  setupKingdomWithSettlement({ name: 'City9', gridSize: 9, lots });
  assert.strictEqual(countBuiltBlocks(settlement), 9, '9x9 settlement has nine blocks');
  assert.strictEqual(KingdomService.calculateConsumption().food, 4, 'city consumption');
}

function testFarmlandConsumption() {
  const houses = 'Houses';
  let lots = Array(36).fill().map(() => emptyLot());
  const townHouseIndices = [0, 3, 18, 21];
  townHouseIndices.forEach(i => { lots[i] = lotWith(houses); });
  const settlement = { id: 1, name: 'FarmTown', gridSize: 6, lots, influenceHexes: [{ x: 1, y: 1 }] };
  setupKingdomWithSettlement(settlement);
  getKingdom().farmlandHexes = [
    { settlementId: 1 },
    { x: 1, y: 1 },
    { x: 10, y: 10 }
  ];
  assert.strictEqual(KingdomService.calculateConsumption().food, 0, 'farmland in influence reduces consumption');
}

function testRPConversion() {
  setupBasicKingdom(1);
  getKingdom().xp = 0;
  getKingdom().treasury = 10;
  getKingdom().ruins = {
    corruption: { points: 0, penalty: 0, threshold: 10 },
    crime: { points: 0, penalty: 0, threshold: 10 },
    decay: { points: 0, penalty: 0, threshold: 10 },
    strife: { points: 0, penalty: 0, threshold: 10 }
  };
  setTurnData({
    turnXP: 0,
    turnUnrest: 0,
    turnFame: 0,
    turnResourcePoints: 5,
    turnCorruption: 0,
    turnCrime: 0,
    turnDecay: 0,
    turnStrife: 0
  });
  const startXP = getKingdom().xp || 0;
  TurnService.saveTurn();
  assert.strictEqual(getKingdom().treasury, 10, 'treasury unchanged after save');
  assert.strictEqual(getKingdom().xp, startXP + 5, 'unspent RP converted to XP');
}

function createSkills(names) {
  const obj = {};
  names.forEach(n => { obj[n] = { prof: 0, item: 0, status: 0, circ: 0, other: 0 }; });
  getKingdom().skills = obj;
}

function setLeaders(investedRoles) {
  const roles = ['ruler','counselor','general','emissary','magister','treasurer','viceroy','warden'];
  getKingdom().leaders = {};
  roles.forEach(r => {
    const invested = investedRoles.includes(r);
    getKingdom().leaders[r] = { name: r, isInvested: invested, status: invested ? 'PC' : 'Vacant' };
  });
}

function testStatusBonus() {
  setupBasicKingdom(1);
  getKingdom().baseLoyalty = 10;
  getKingdom().ruins = { corruption:{penalty:0}, crime:{penalty:0}, decay:{penalty:0}, strife:{penalty:0} };
  createSkills(['Warfare']);
  setLeaders(['ruler']);
  assert.strictEqual(KingdomService.getStatusBonusForAbility('loyalty'), 1, 'level 1 invested gives +1');

  const mods = KingdomService.calculateSkillModifiers();
  assert.strictEqual(mods.Warfare, 1, 'status bonus applied to skill');

  getKingdom().level = 10;
  assert.strictEqual(KingdomService.getStatusBonusForAbility('loyalty'), 2, 'level 10 invested gives +2');

  getKingdom().level = 16;
  assert.strictEqual(KingdomService.getStatusBonusForAbility('loyalty'), 3, 'level 16 invested gives +3');
}

try {
  testOvercrowding();
  testCanAttemptClaimHex();
  testCanAttemptLeadershipActivity();
  testPhaseOrder();
  testPhaseProgression();
  testInfrastructurePlacement();
  testCanUpgradeSettlement();
  testConsumption();
  testFarmlandConsumption();
  testRPConversion();
  testStatusBonus();
  console.log('All tests passed.');
} catch (err) {
  console.error('Test failed:', err);
  process.exitCode = 1;
}
