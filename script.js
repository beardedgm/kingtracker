// ==========================================
// KINGDOM TRACKER - IMPROVED VERSION
// ==========================================

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const CONFIG = {
  STORAGE_KEY: "pf2eKingdomTrackerData",
  VERSION: "1.1.0",
  AUTOSAVE_INTERVAL: 30000,
  DEBOUNCE_DELAY: 150,
  MAX_HISTORY_ENTRIES: 50,
  XP_CAP: 1000,
  NOTIFICATION_TIMEOUT: 5000
};

const KINGDOM_SKILLS = {
  Agriculture: "stability",
  Arts: "culture",
  Boating: "economy",
  Defense: "stability",
  Engineering: "stability",
  Exploration: "economy",
  Folklore: "culture",
  Industry: "economy",
  Intrigue: "loyalty",
  Magic: "culture",
  Politics: "loyalty",
  Scholarship: "culture",
  Statecraft: "loyalty",
  Trade: "economy",
  Warfare: "loyalty",
  Wilderness: "stability",
};

const KINGDOM_ACTIVITIES = {
  commerce: [
    "Collect Taxes",
    "Improve Lifestyle",
    "Tap Treasury",
    "Trade Commodities",
    "Manage Trade Agreements",
  ],
  leadership: [
    "Capital Investment",
    "Celebrate Holiday",
    "Clandestine Business",
    "Craft Luxuries",
    "Create a Masterpiece",
    "Creative Solution",
    "Establish Trade Agreement",
    "Focused Attention",
    "Hire Adventurers",
    "Infiltration",
    "Pledge of Fealty",
    "Prognostication",
    "Provide Care",
    "Purchase Commodities",
    "Quell Unrest",
    "Recruit Army",
    "Relocate Capital",
    "Repair Reputation",
    "Request Foreign Aid",
    "Rest and Relax",
    "Send Diplomatic Envoy",
    "Supernatural Solution",
  ],
  region: [
    "Abandon Hex",
    "Build Roads",
    "Claim Hex",
    "Clear Hex",
    "Establish Farmland",
    "Establish Settlement",
    "Establish Work Site",
    "Fortify Hex",
    "Go Fishing",
    "Gather Livestock",
    "Harvest Crops",
    "Irrigation",
  ],
  civic: ["Build Structure", "Demolish"],
};

const RANDOM_KINGDOM_EVENTS = [
    { min: 1, max: 3, name: "Archaeological Find" },
    { min: 4, max: 5, name: "Assassination Attempt" },
    { min: 6, max: 7, name: "Bandit Activity" },
    { min: 8, max: 10, name: "Boomtown" },
    { min: 11, max: 14, name: "Building Demand" },
    { min: 15, max: 17, name: "Crop Failure" },
    { min: 18, max: 19, name: "Cult Activity" },
    { min: 20, max: 22, name: "Diplomatic Overture" },
    { min: 23, max: 25, name: "Discovery" },
    { min: 26, max: 27, name: "Drug Den" },
    { min: 28, max: 28, name: "Economic Surge" },
    { min: 29, max: 31, name: "Expansion Demand" },
    { min: 32, max: 34, name: "Festive Invitation" },
    { min: 35, max: 37, name: "Feud" },
    { min: 38, max: 39, name: "Food Shortage" },
    { min: 40, max: 42, name: "Food Surplus" },
    { min: 43, max: 44, name: "Good Weather" },
    { min: 45, max: 46, name: "Inquisition" },
    { min: 47, max: 49, name: "Justice Prevails" },
    { min: 50, max: 51, name: "Land Rush" },
    { min: 52, max: 54, name: "Local Disaster" },
    { min: 55, max: 57, name: "Monster Activity" },
    { min: 58, max: 58, name: "Natural Disaster" },
    { min: 59, max: 61, name: "Nature's Blessing" },
    { min: 62, max: 64, name: "New Subjects" },
    { min: 65, max: 67, name: "Noblesse Oblige" },
    { min: 68, max: 70, name: "Outstanding Success" },
    { min: 71, max: 72, name: "Pilgrimage" },
    { min: 73, max: 74, name: "Plague" },
    { min: 75, max: 78, name: "Political Calm" },
    { min: 79, max: 81, name: "Public Scandal" },
    { min: 82, max: 82, name: "Remarkable Treasure" },
    { min: 83, max: 83, name: "Sacrifices" },
    { min: 84, max: 85, name: "Sensational Crime" },
    { min: 86, max: 90, name: "Squatters" },
    { min: 91, max: 92, name: "Undead Uprising" },
    { min: 93, max: 95, name: "Unexpected Find" },
    { min: 96, max: 97, name: "Vandals" },
    { min: 98, max: 99, name: "Visiting Celebrity" },
    { min: 100, max: 100, name: "Wealthy Immigrant" }
];

const LEADER_ROLES_MAP = {
    ruler: "Loyalty",
    counselor: "Culture",
    general: "Stability",
    emissary: "Loyalty",
    magister: "Culture",
    treasurer: "Economy",
    viceroy: "Economy",
    warden: "Stability"
};

const KINGDOM_FEATS = [
    { name: "Civil Service", level: 1, prereq: null, description: "Vacancy penalty for one leadership role is no longer applicable." },
    { name: "Cooperative Leadership", level: 1, prereq: null, description: "Leaders gain increased bonuses when aiding each other." },
    { name: "Crush Dissent", level: 1, prereq: { skill: "Warfare", rank: 1 }, description: "Use Warfare to cancel an Unrest increase." },
    { name: "Fortified Fiefs", level: 1, prereq: { skill: "Defense", rank: 1 }, description: "Gain bonuses to Fortify Hex and build defensive structures." },
    { name: "Insider Trading", level: 1, prereq: { skill: "Industry", rank: 1 }, description: "Gain bonuses to several Industry and Trade activities." },
    { name: "Kingdom Assurance", level: 1, prereq: { trainedSkills: 3 }, description: "Once per turn, take a fixed result of 10+prof on a chosen skill check." },
    { name: "Muddle Through", level: 1, prereq: { skill: "Wilderness", rank: 1 }, description: "Increase your Ruin thresholds, making them accumulate slower." },
    { name: "Practical Magic", level: 1, prereq: { skill: "Magic", rank: 1 }, description: "Use Magic instead of Engineering for some checks; reduce Hire Adventurers cost." },
    { name: "Pull Together", level: 1, prereq: { skill: "Politics", rank: 1 }, description: "Once per turn, attempt a flat check to turn a critical failure into a regular failure." },
    { name: "Skill Training", level: 1, prereq: null, description: "Become trained in a Kingdom skill of your choice." },
    { name: "Endure Anarchy", level: 3, prereq: { ability: "Loyalty", value: 14 }, description: "Recover from Unrest faster and fall into anarchy at a higher Unrest value." },
    { name: "Inspiring Entertainment", level: 3, prereq: { ability: "Culture", value: 14 }, description: "Use Culture-based checks to manage Unrest and gain bonuses while Unrest is high." },
    { name: "Liquidate Resources", level: 3, prereq: { ability: "Economy", value: 14 }, description: "Once per turn, avoid spending RP from a failed check at a cost to future turns." },
    { name: "Quick Recovery", level: 3, prereq: { ability: "Stability", value: 14 }, description: "Gain a +4 bonus to checks to end ongoing harmful kingdom events." },
    { name: "Free and Fair", level: 7, prereq: null, description: "Gain bonuses to New Leadership and Pledge of Fealty activities." },
    { name: "Quality of Life", level: 7, prereq: null, description: "Reduce cost of living and increase availability of magic items in settlements." },
    { name: "Fame and Fortune", level: 11, prereq: null, description: "Gain bonus Resource Dice on critical successes during the Activity phase." }
];

const PROFICIENCY_RANKS = ["Untrained", "Trained", "Expert", "Master", "Legendary"];

const KINGDOM_CHARTERS = {
  conquest: { name: "Conquest", boosts: ["loyalty", "free"], flaw: "culture" },
  expansion: { name: "Expansion", boosts: ["culture", "free"], flaw: "stability" },
  exploration: { name: "Exploration", boosts: ["stability", "free"], flaw: "economy" },
  grant: { name: "Grant", boosts: ["economy", "free"], flaw: "loyalty" },
  open: { name: "Open", boosts: ["free"], flaw: null },
};

const KINGDOM_HEARTLANDS = {
  forest_swamp: { name: "Forest or Swamp", boost: "culture" },
  hill_plain: { name: "Hill or Plain", boost: "loyalty" },
  lake_river: { name: "Lake or River", boost: "economy" },
  mountain_ruins: { name: "Mountain or Ruins", boost: "stability" },
};

const KINGDOM_GOVERNMENTS = {
  despotism: {
    name: "Despotism",
    boosts: ["stability", "economy", "free"],
    skills: ["Intrigue", "Warfare"],
    feat: "Crush Dissent",
  },
  feudalism: {
    name: "Feudalism",
    boosts: ["stability", "culture", "free"],
    skills: ["Defense", "Trade"],
    feat: "Fortified Fiefs",
  },
  oligarchy: {
    name: "Oligarchy",
    boosts: ["loyalty", "economy", "free"],
    skills: ["Arts", "Industry"],
    feat: "Insider Trading",
  },
  republic: {
    name: "Republic",
    boosts: ["stability", "loyalty", "free"],
    skills: ["Engineering", "Politics"],
    feat: "Pull Together",
  },
  thaumocracy: {
    name: "Thaumocracy",
    boosts: ["economy", "culture", "free"],
    skills: ["Folklore", "Magic"],
    feat: "Practical Magic",
  },
  yeomanry: {
    name: "Yeomanry",
    boosts: ["loyalty", "culture", "free"],
    skills: ["Agriculture", "Wilderness"],
    feat: "Muddle Through",
  },
};

const KINGDOM_ADVANCEMENT_TABLE = [
  { level: 1, dc: 14 }, { level: 2, dc: 15 }, { level: 3, dc: 16 },
  { level: 4, dc: 18 }, { level: 5, dc: 20 }, { level: 6, dc: 22 },
  { level: 7, dc: 23 }, { level: 8, dc: 24 }, { level: 9, dc: 26 },
  { level: 10, dc: 27 }, { level: 11, dc: 28 }, { level: 12, dc: 30 },
  { level: 13, dc: 31 }, { level: 14, dc: 32 }, { level: 15, dc: 34 },
  { level: 16, dc: 35 }, { level: 17, dc: 36 }, { level: 18, dc: 38 },
  { level: 19, dc: 39 }, { level: 20, dc: 40 },
];

const KINGDOM_SIZE_TABLE = [
  { min: 1, max: 9, mod: 0, die: 4, storage: 4 },
  { min: 10, max: 24, mod: 1, die: 6, storage: 8 },
  { min: 25, max: 49, mod: 2, die: 8, storage: 12 },
  { min: 50, max: 99, mod: 3, die: 10, storage: 16 },
  { min: 100, max: Infinity, mod: 4, die: 12, storage: 20 },
];

const STRUCTURE_COLORS = {
  Residential: "#dcedc8", Infrastructure: "#b3e5fc",
  Commercial: "#fff9c4", Government: "#cfd8dc",
  Defensive: "#ffcdd2", Industrial: "#d7ccc8",
  Magical: "#e1bee7", Demolish: "#ef5350",
};

const AVAILABLE_STRUCTURES = [
    // --- ONE-LOT BUILDINGS ---
    {
        name: "Alchemy Laboratory",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 18, ore: 2, stone: 5 },
        construction: { skill: "Industry", rank: "trained", dc: 16 },
        itemBonus: [{ target: "Demolish", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for availability of alchemical items (stacks up to 3 times). +1 item bonus to Identify Alchemy checks in any settlement with one."
    },
    {
        name: "Arcanist's Tower",
        level: 5,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 30, stone: 6 },
        construction: { skill: "Magic", rank: "trained", dc: 20 },
        itemBonus: [{ target: "Quell Unrest (Magic)", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for availability of arcane items (stacks up to 3 times). +1 item bonus to Borrow an Arcane Spell or Learn a Spell checks."
    },
    {
        name: "Bank",
        level: 5,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 28, ore: 4, stone: 6 },
        construction: { skill: "Trade", rank: "trained", dc: 20 },
        itemBonus: [{ target: "Tap Treasury", type: "item", value: 1 }],
        effects: "The Capital Investment activity can be used only within the influence area of a settlement with a bank."
    },
    {
        name: "Barracks",
        level: 3,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 2, stone: 1 },
        construction: { skill: "Defense", rank: "trained", dc: 16 },
        upgradeTo: ["Garrison"],
        itemBonus: [
            { target: "Garrison Army", type: "item", value: 1 },
            { target: "Recover Army", type: "item", value: 1 },
            { target: "Recruit Army", type: "item", value: 1 }
        ],
        effects: "The first time you build a barracks, reduce Unrest by 1."
    },
    {
        name: "Brewery",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 2 },
        construction: { skill: "Agriculture", rank: "trained", dc: 15 },
        itemBonus: [{ target: "Establish Trade Agreement", type: "item", value: 1 }],
        effects: "When you build a brewery, reduce Unrest by 1 (max 4 breweries/settlement)."
    },
    {
        name: "Cemetery",
        level: 1,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 4, stone: 1 },
        construction: { skill: "Folklore", rank: "trained", dc: 15 },
        effects: "Reduce Unrest gained from dangerous settlement events in this settlement by 1 per cemetery (max 4)."
    },
    {
        name: "Dump",
        level: 2,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 4 },
        construction: { skill: "Industry", rank: "trained", dc: 16 },
        itemBonus: [{ target: "Demolish", type: "item", value: 1 }],
        effects: "A dump can't be located in a block with any Residential structures. Some events are more dangerous in settlements without a dump."
    },
    {
        name: "Festival Hall",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 7, lumber: 3 },
        construction: { skill: "Arts", rank: "trained", dc: 18 },
        upgradeTo: ["Theater"],
        itemBonus: [{ target: "Celebrate Holiday", type: "item", value: 1 }]
    },
    {
        name: "General Store",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 8, lumber: 1 },
        construction: { skill: "Trade", rank: "trained", dc: 15 },
        upgradeTo: ["Luxury Store", "Marketplace"],
        effects: "A settlement without a General Store or Marketplace has its effective level reduced by 2 for item availability."
    },
    {
        name: "Granary",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 12, lumber: 2 },
        construction: { skill: "Agriculture", rank: "trained", dc: 15 },
        storageMod: { type: "Food", value: 1 },
        effects: "Increases your maximum Food Commodity capacity by 1."
    },
    {
        name: "Herbalist",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 1 },
        construction: { skill: "Wilderness", rank: "trained", dc: 15 },
        upgradeTo: ["Hospital"],
        itemBonus: [{ target: "Provide Care", type: "item", value: 1 }]
    },
    {
        name: "Houses",
        level: 1,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 3, lumber: 1 },
        construction: { skill: "Industry", rank: "trained", dc: 15 },
        upgradeFrom: ["Tenement"],
        upgradeTo: ["Mansion", "Orphanage"],
        effects: "The first time you build houses each Kingdom turn, reduce Unrest by 1."
    },
    {
        name: "Illicit Market",
        level: 6,
        traits: ["Building", "Infamous"],
        lots: [1, 1],
        cost: { rp: 50, lumber: 5 },
        construction: { skill: "Intrigue", rank: "trained", dc: 22 },
        ruin: { type: "Crime", value: 1 },
        itemBonus: [{ target: "Clandestine Business", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for item availability (stacks up to 3 times)."
    },
    {
        name: "Inn",
        level: 1,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 2 },
        construction: { skill: "Trade", rank: "trained", dc: 15 },
        itemBonus: [{ target: "Hire Adventurers", type: "item", value: 1 }]
    },
    {
        name: "Jail",
        level: 2,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 14, lumber: 4, ore: 2, stone: 4 },
        construction: { skill: "Defense", rank: "trained", dc: 16 },
        itemBonus: [{ target: "Quell Unrest (Intrigue)", type: "item", value: 1 }],
        effects: "The first time you build a jail each Kingdom turn, reduce Crime by 1."
    },
    {
        name: "Library",
        level: 2,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 4, stone: 2 },
        construction: { skill: "Scholarship", rank: "trained", dc: 16 },
        upgradeTo: ["Academy"],
        itemBonus: [{ target: "Rest and Relax (Scholarship)", type: "item", value: 1 }],
        effects: "While in a settlement with a library, gain a +1 item bonus to certain Lore, Researching, and Decipher Writing checks."
    },
    {
        name: "Luxury Store",
        level: 6,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 28, lumber: 10, luxuries: 6 },
        construction: { skill: "Trade", rank: "expert", dc: 22 },
        upgradeFrom: ["General Store"],
        upgradeTo: ["Magic Shop"],
        itemBonus: [{ target: "Establish Trade Agreement", type: "item", value: 1 }],
        effects: "Must be in a block with a Mansion or Noble Villa. Treats settlement level as +1 for availability of luxury items (stacks up to 3 times)."
    },
    {
        name: "Magic Shop",
        level: 8,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 44, lumber: 8, luxuries: 6, stone: 6 },
        construction: { skill: "Magic", rank: "expert", dc: 24 },
        upgradeFrom: ["Luxury Store"],
        upgradeTo: ["Occult Shop"],
        itemBonus: [{ target: "Supernatural Solution", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for item availability (stacks up to 3 times)."
    },
    {
        name: "Mansion",
        level: 5,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 6, luxuries: 6, stone: 3 },
        construction: { skill: "Industry", rank: "trained", dc: 20 },
        upgradeFrom: ["Houses"],
        upgradeTo: ["Noble Villa"],
        itemBonus: [{ target: "Improve Lifestyle", type: "item", value: 1 }]
    },
    {
        name: "Mill",
        level: 2,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 2, stone: 1 },
        construction: { skill: "Industry", rank: "trained", dc: 16 },
        itemBonus: [{ target: "Harvest Crops", type: "item", value: 1 }],
        consumptionMod: -1,
        effects: "Reduces the settlement’s Consumption by 1 (requires water border for full effect per some interpretations, simplified here)."
    },
    {
        name: "Mint",
        level: 15,
        traits: ["Building", "Edifice"],
        lots: [1, 1],
        cost: { rp: 30, lumber: 12, ore: 20, stone: 16 },
        construction: { skill: "Trade", rank: "master", dc: 34 },
        itemBonus: [
            { target: "Capital Investment", type: "item", value: 3 },
            { target: "Collect Taxes", type: "item", value: 3 },
            { target: "Repair Reputation (Crime)", type: "item", value: 3 }
        ]
    },
    {
        name: "Monument",
        level: 3,
        traits: ["Building", "Edifice"],
        lots: [1, 1],
        cost: { rp: 6, stone: 1 },
        construction: { skill: "Arts", rank: "trained", dc: 18 },
        effects: "The first time you build a monument each Kingdom turn, reduce Unrest by 1 and one Ruin of your choice by 1."
    },
    {
        name: "Occult Shop",
        level: 13,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 68, lumber: 12, luxuries: 12, stone: 6 },
        construction: { skill: "Magic", rank: "master", dc: 32 },
        upgradeFrom: ["Magic Shop"],
        itemBonus: [{ target: "Prognostication", type: "item", value: 2 }],
        effects: "Treats settlement level as +1 for item availability (stacks up to 3 times). +2 item bonus to esoteric Research or Recall Knowledge checks."
    },
    {
        name: "Orphanage",
        level: 2,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 2 },
        construction: { skill: "Industry", rank: "trained", dc: 16 },
        upgradeFrom: ["Houses"],
        effects: "The first time you build an orphanage each Kingdom turn, reduce Unrest by 1."
    },
    {
        name: "Park",
        level: 3,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 5 },
        construction: { skill: "Wilderness", rank: "trained", dc: 18 },
        upgradeTo: ["Menagerie"],
        itemBonus: [{ target: "Rest and Relax (Wilderness)", type: "item", value: 1 }],
        effects: "The first time you build a park each Kingdom turn, reduce Unrest by 1."
    },
    {
        name: "Pier",
        level: 3,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 16, lumber: 2 },
        construction: { skill: "Boating", rank: "trained", dc: 18 },
        upgradeTo: ["Waterfront"],
        itemBonus: [{ target: "Go Fishing", type: "item", value: 1 }],
        effects: "Must be built adjacent to a Water Border."
    },
    {
        name: "Sacred Grove",
        level: 5,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 36 },
        construction: { skill: "Wilderness", rank: "trained", dc: 20 },
        itemBonus: [{ target: "Quell Unrest (Folklore)", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for availability of primal items (stacks up to 3 times)."
    },
    {
        name: "Shrine",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 8, lumber: 2, stone: 1 },
        construction: { skill: "Folklore", rank: "trained", dc: 15 },
        upgradeTo: ["Temple"],
        itemBonus: [{ target: "Celebrate Holiday", type: "item", value: 1 }],
        effects: "Treats settlement level as +1 for availability of divine items (stacks up to 3 times)."
    },
    {
        name: "Smithy",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 8, lumber: 2, ore: 1, stone: 1 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [
            { target: "Trade Commodities", type: "item", value: 1 },
            { target: "Outfit Army", type: "item", value: 1 }
        ],
        effects: "Gain a +1 item bonus to Craft checks made to work with metal."
    },
    {
        name: "Specialized Artisan",
        level: 4,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 4, luxuries: 1 },
        construction: { skill: "Trade", rank: "expert", dc: 19 },
        itemBonus: [{ target: "Craft Luxuries", type: "item", value: 1 }],
        effects: "Gain a +1 item bonus to Craft checks for specialized goods."
    },
    {
        name: "Stable",
        level: 3,
        traits: ["Yard"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 2 },
        construction: { skill: "Wilderness", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Establish Trade Agreement", type: "item", value: 1 }]
    },
    {
        name: "Tannery",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 6, lumber: 2 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Trade Commodities", type: "item", value: 1 }],
        effects: "Cannot share a block with any Residential structure except tenements."
    },
    {
        name: "Tavern, Dive",
        level: 1,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 12, lumber: 1 },
        construction: { skill: "Trade", rank: "trained", dc: 15 },
        upgradeTo: ["Tavern, Popular"],
        ruin: { type: "Crime", value: 1 },
        effects: "The first time you build a dive tavern in a Kingdom turn, reduce Unrest by 1 but increase Crime by 1."
    },
    {
        name: "Tavern, Popular",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 24, lumber: 6, stone: 2 },
        construction: { skill: "Trade", rank: "expert", dc: 18 },
        upgradeFrom: ["Tavern, Dive"],
        upgradeTo: ["Tavern, Luxury"],
        itemBonus: [
            { target: "Hire Adventurers", type: "item", value: 1 },
            { target: "Rest and Relax (Trade)", type: "item", value: 1 }
        ],
        effects: "Reduce Unrest by 2 first time built per turn. +1 item bonus to Gather Information and Performance (Earn Income) checks."
    },
    {
        name: "Tenement",
        level: 0,
        traits: ["Building", "Residential"],
        lots: [1, 1],
        cost: { rp: 1, lumber: 1 },
        construction: { skill: "Industry", rank: "trained", dc: 14 },
        upgradeTo: ["Houses"],
        ruin: { type: "Any", value: 1 },
        effects: "The first time you build tenements each Kingdom turn, reduce Unrest by 1. User chooses which Ruin to increase."
    },
    {
        name: "Thieves' Guild",
        level: 5,
        traits: ["Building", "Infamous"],
        lots: [1, 1],
        cost: { rp: 25, lumber: 4 },
        construction: { skill: "Intrigue", rank: "trained", dc: 20 },
        ruin: { type: "Crime", value: 1 },
        itemBonus: [{ target: "Infiltration", type: "item", value: 1 }],
        effects: "Gain a +1 item bonus to Create Forgeries checks."
    },
    {
        name: "Trade Shop",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 10, lumber: 2 },
        construction: { skill: "Trade", rank: "trained", dc: 18 },
        upgradeTo: ["Guildhall"],
        itemBonus: [{ target: "Purchase Commodities", type: "item", value: 1 }],
        effects: "Gain a +1 item bonus to associated Crafting checks (e.g., a bakery for baking)."
    },
    {
        name: "Watchtower",
        level: 3,
        traits: ["Building"],
        lots: [1, 1],
        cost: { rp: 12, lumber: 4, stone: 4 }, // Rulebook says "or", we'll assume both are available options but code requires one. Let's make it a cost.
        construction: { skill: "Defense", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Resolve Settlement Event", type: "item", value: 1 }],
        effects: "The first time you build a watchtower each Kingdom turn, decrease Unrest by 1."
    },

    // --- TWO-LOT BUILDINGS ---
    {
        name: "Academy",
        level: 10,
        traits: ["Building", "Edifice"],
        lots: [2, 1],
        cost: { rp: 52, lumber: 12, luxuries: 6, stone: 12 },
        construction: { skill: "Scholarship", rank: "expert", dc: 27 },
        upgradeFrom: ["Library"],
        upgradeTo: ["Military Academy", "University"],
        itemBonus: [{ target: "Creative Solution", type: "item", value: 2 }],
        effects: "While in a settlement with an Academy, gain a +2 item bonus to certain Lore, Researching, and Decipher Writing checks."
    },
    {
        name: "Embassy",
        level: 8,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 26, lumber: 10, luxuries: 6, stone: 4 },
        construction: { skill: "Politics", rank: "expert", dc: 24 },
        itemBonus: [
            { target: "Send Diplomatic Envoy", type: "item", value: 1 },
            { target: "Request Foreign Aid", type: "item", value: 1 }
        ]
    },
    {
        name: "Foundry",
        level: 3,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 16, lumber: 5, ore: 2, stone: 3 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Establish Work Site (Mine)", type: "item", value: 1 }],
        storageMod: { type: "Ore", value: 1 },
        effects: "Increases your maximum Ore Commodity capacity by 1. Cannot share a block with a Residential structure."
    },
    {
        name: "Garrison",
        level: 5,
        traits: ["Building", "Residential"],
        lots: [2, 1],
        cost: { rp: 28, lumber: 6, stone: 3 },
        construction: { skill: "Warfare", rank: "trained", dc: 20 },
        upgradeFrom: ["Barracks"],
        itemBonus: [
            { target: "Outfit Army", type: "item", value: 1 },
            { target: "Train Army", type: "item", value: 1 }
        ],
        effects: "When you build a garrison, reduce Unrest by 1."
    },
    {
        name: "Guildhall",
        level: 5,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 34, lumber: 8 },
        construction: { skill: "Trade", rank: "expert", dc: 20 },
        upgradeFrom: ["Trade Shop"],
        itemBonus: [{ target: "Economy (Trade Focus)", type: "item", value: 1 }],
        effects: "Bonus applies to Economy checks related to the guild's focus. +1 item bonus to related Earn Income or Repair checks."
    },
    {
        name: "Hospital",
        level: 9,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 30, lumber: 10, stone: 6 },
        construction: { skill: "Defense", rank: "expert", dc: 26 },
        upgradeFrom: ["Herbalist"],
        itemBonus: [
            { target: "Provide Care", type: "item", value: 1 },
            { target: "Quell Unrest", type: "item", value: 1 }
        ],
        effects: "Gain a +2 item bonus to Medicine checks to Treat Disease and Treat Wounds."
    },
    {
        name: "Keep",
        level: 3,
        traits: ["Building", "Edifice"],
        lots: [2, 1],
        cost: { rp: 32, lumber: 8, stone: 8 },
        construction: { skill: "Defense", rank: "trained", dc: 18 },
        itemBonus: [
            { target: "Deploy Army", type: "item", value: 1 },
            { target: "Garrison Army", type: "item", value: 1 },
            { target: "Train Army", type: "item", value: 1 }
        ],
        effects: "The first time you build a keep each Kingdom turn, reduce Unrest by 1."
    },
    {
        name: "Lumberyard",
        level: 3,
        traits: ["Yard"],
        lots: [2, 1],
        cost: { rp: 16, lumber: 5, ore: 1 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Establish Work Site (Lumber Camp)", type: "item", value: 1 }],
        storageMod: { type: "Lumber", value: 1 },
        effects: "Increases maximum Lumber capacity by 1. Must be built next to a Water border."
    },
    {
        name: "Marketplace",
        level: 4,
        traits: ["Building", "Residential"],
        lots: [2, 1],
        cost: { rp: 48, lumber: 4 },
        construction: { skill: "Trade", rank: "trained", dc: 19 },
        upgradeFrom: ["General Store"],
        itemBonus: [{ target: "Establish Trade Agreement", type: "item", value: 1 }],
        effects: "A town without a general store or marketplace reduces its effective level for the purposes of determining what items can be purchased there by 2."
    },
    {
        name: "Military Academy",
        level: 12,
        traits: ["Building", "Edifice"],
        lots: [2, 1],
        cost: { rp: 36, lumber: 12, ore: 6, stone: 10 },
        construction: { skill: "Warfare", rank: "expert", dc: 30 },
        upgradeFrom: ["Academy"],
        itemBonus: [
            { target: "Pledge of Fealty (Warfare)", type: "item", value: 2 },
            { target: "Train Army", type: "item", value: 2 }
        ]
    },
    {
        name: "Museum",
        level: 5,
        traits: ["Building", "Famous", "Infamous"],
        lots: [2, 1],
        cost: { rp: 30, lumber: 6, stone: 2 },
        construction: { skill: "Exploration", rank: "trained", dc: 20 },
        itemBonus: [{ target: "Rest and Relax (Arts)", type: "item", value: 1 }],
        effects: "Donating a magic item of level 6+ reduces Unrest by 1."
    },
    {
        name: "Noble Villa",
        level: 9,
        traits: ["Building", "Residential"],
        lots: [2, 1],
        cost: { rp: 24, lumber: 10, luxuries: 6, stone: 8 },
        construction: { skill: "Politics", rank: "expert", dc: 19 },
        upgradeFrom: ["Mansion"],
        itemBonus: [
            { target: "Improve Lifestyle", type: "item", value: 1 },
            { target: "Quell Unrest (Politics)", type: "item", value: 1 }
        ],
        effects: "The first time you build a noble villa each Kingdom turn, reduce Unrest by 2."
    },
    {
        name: "Opera House",
        level: 15,
        traits: ["Building", "Edifice", "Famous", "Infamous"],
        lots: [2, 1],
        cost: { rp: 40, lumber: 20, luxuries: 18, stone: 16 },
        construction: { skill: "Arts", rank: "master", dc: 34 },
        upgradeFrom: ["Theater"],
        itemBonus: [
            { target: "Celebrate Holiday", type: "item", value: 3 },
            { target: "Create a Masterpiece", type: "item", value: 3 }
        ],
        effects: "Reduce Unrest by 4 first time built per turn. +3 item bonus to Performance (Earn Income) checks."
    },
    {
        name: "Secure Warehouse",
        level: 6,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 24, lumber: 6, ore: 4, stone: 6 },
        construction: { skill: "Industry", rank: "expert", dc: 22 },
        itemBonus: [{ target: "Craft Luxuries", type: "item", value: 1 }],
        storageMod: { type: "Luxuries", value: 1 },
        effects: "Increases your maximum Luxuries Commodity capacity by 1."
    },
    {
        name: "Stonemason",
        level: 3,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 16, lumber: 2 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Establish Work Site (Quarry)", type: "item", value: 1 }],
        storageMod: { type: "Stone", value: 1 },
        effects: "Increases your maximum Stone Commodity capacity by 1."
    },
    {
        name: "Tavern, Luxury",
        level: 9,
        traits: ["Building", "Famous"],
        lots: [2, 1],
        cost: { rp: 48, lumber: 10, luxuries: 8, stone: 8 },
        construction: { skill: "Trade", rank: "master", dc: 26 },
        upgradeFrom: ["Tavern, Popular"],
        upgradeTo: ["Tavern, World-Class"],
        itemBonus: [
            { target: "Hire Adventurers", type: "item", value: 2 },
            { target: "Rest and Relax (Trade)", type: "item", value: 2 }
        ],
        effects: "Reduce Unrest by 1d4+1 first time built per turn. +2 item bonus to Gather Information and Performance (Earn Income) checks."
    },
    {
        name: "Tavern, World-Class",
        level: 15,
        traits: ["Building", "Edifice", "Famous"],
        lots: [2, 1],
        cost: { rp: 64, lumber: 18, luxuries: 15, stone: 15 },
        construction: { skill: "Trade", rank: "master", dc: 34 },
        upgradeFrom: ["Tavern, Luxury"],
        itemBonus: [
            { target: "Hire Adventurers", type: "item", value: 3 },
            { target: "Rest and Relax (Trade)", type: "item", value: 3 },
            { target: "Repair Reputation (Strife)", type: "item", value: 3 }
        ],
        effects: "Reduce Unrest by 2d4 first time built per turn. +3 item bonus to Gather Information and Performance (Earn Income) checks."
    },
    {
        name: "Temple",
        level: 7,
        traits: ["Building", "Famous", "Infamous"],
        lots: [2, 1],
        cost: { rp: 32, lumber: 6, stone: 6 },
        construction: { skill: "Folklore", rank: "trained", dc: 23 },
        upgradeFrom: ["Shrine"],
        upgradeTo: ["Cathedral"],
        itemBonus: [
            { target: "Celebrate Holiday", type: "item", value: 1 },
            { target: "Provide Care", type: "item", value: 1 }
        ],
        effects: "Reduce Unrest by 2 first time built per turn. Treats settlement level as +1 for divine item availability (stacks up to 3 times, doesn't stack with Shrine/Cathedral)."
    },
    {
        name: "Theater",
        level: 9,
        traits: ["Building"],
        lots: [2, 1],
        cost: { rp: 24, lumber: 8, stone: 3 },
        construction: { skill: "Arts", rank: "expert", dc: 26 },
        upgradeFrom: ["Festival Hall"],
        upgradeTo: ["Opera House"],
        itemBonus: [{ target: "Celebrate Holiday", type: "item", value: 2 }],
        effects: "Reduce Unrest by 1 first time built per turn. +2 item bonus to Performance (Earn Income) checks."
    },
    {
        name: "Town Hall",
        level: 2,
        traits: ["Building", "Edifice"],
        lots: [2, 1],
        cost: { rp: 22, lumber: 4, stone: 4 },
        construction: { skill: "Any", rank: "trained", dc: 16 }, // Any of Defense, Industry, Magic, or Statecraft
        upgradeTo: ["Castle"],
        effects: "Reduce Unrest by 1 first time built per turn. Allows 3 Leadership Activities instead of 2 if in capital."
    },

    // --- FOUR-LOT BUILDINGS ---
    {
        name: "Arena",
        level: 9,
        traits: ["Yard", "Edifice"],
        lots: [2, 2],
        cost: { rp: 40, lumber: 6, stone: 12 },
        construction: { skill: "Warfare", rank: "expert", dc: 26 },
        itemBonus: [
            { target: "Celebrate Holiday", type: "item", value: 2 },
            { target: "Quell Unrest (Warfare)", type: "item", value: 2 }
        ],
        effects: "Allows retraining of combat-themed feats in 5 days instead of a week."
    },
    {
        name: "Castle",
        level: 9,
        traits: ["Building", "Edifice", "Famous", "Infamous"],
        lots: [2, 2],
        cost: { rp: 54, lumber: 12, stone: 12 },
        construction: { skill: "Any", rank: "expert", dc: 26 }, // Any of Defense, Industry, Magic, or Statecraft
        upgradeFrom: ["Town Hall"],
        upgradeTo: ["Palace"],
        itemBonus: [
            { target: "New Leadership", type: "item", value: 2 },
            { target: "Pledge of Fealty", type: "item", value: 2 },
            { target: "Send Diplomatic Envoy", type: "item", value: 2 },
            { target: "Garrison Army", type: "item", value: 2 },
            { target: "Recover Army", type: "item", value: 2 },
            { target: "Recruit Army", type: "item", value: 2 }
        ],
        effects: "Reduce Unrest by 1d4 first time built per turn. Allows 3 Leadership Activities if in capital."
    },
    {
        name: "Cathedral",
        level: 15,
        traits: ["Building", "Edifice", "Famous", "Infamous"],
        lots: [2, 2],
        cost: { rp: 58, lumber: 20, stone: 20 },
        construction: { skill: "Folklore", rank: "master", dc: 34 },
        upgradeFrom: ["Temple"],
        itemBonus: [
            { target: "Celebrate Holiday", type: "item", value: 3 },
            { target: "Provide Care", type: "item", value: 3 },
            { target: "Repair Reputation (Corruption)", type: "item", value: 3 }
        ],
        effects: "Reduce Unrest by 4 first time built per turn. +3 item bonus to certain Lore/Religion checks. Treats settlement level as +3 for divine item availability."
    },
    {
        name: "Construction Yard",
        level: 10,
        traits: ["Yard"],
        lots: [2, 2],
        cost: { rp: 40, lumber: 10, stone: 10 },
        construction: { skill: "Engineering", rank: "expert", dc: 27 },
        itemBonus: [
            { target: "Build Structure", type: "item", value: 1 },
            { target: "Repair Reputation (Decay)", type: "item", value: 1 }
        ]
    },
    {
        name: "Menagerie",
        level: 12,
        traits: ["Building", "Edifice"],
        lots: [2, 2],
        cost: { rp: 26, lumber: 14, ore: 10, stone: 10 },
        construction: { skill: "Wilderness", rank: "expert", dc: 30 },
        upgradeFrom: ["Park"],
        itemBonus: [{ target: "Rest and Relax (Wilderness)", type: "item", value: 2 }],
        effects: "Can house captured creatures. Adding a creature of level 6+ grants 1 Fame/Infamy or reduces a Ruin by 1."
    },
    {
        name: "Palace",
        level: 15,
        traits: ["Building", "Edifice", "Famous", "Infamous"],
        lots: [2, 2],
        cost: { rp: 108, lumber: 20, luxuries: 12, ore: 15, stone: 20 },
        construction: { skill: "Any", rank: "master", dc: 34 }, // Any of Defense, Industry, Magic, or Statecraft
        upgradeFrom: ["Castle"],
        itemBonus: [
            { target: "New Leadership", type: "item", value: 3 },
            { target: "Pledge of Fealty", type: "item", value: 3 },
            { target: "Send Diplomatic Envoy", type: "item", value: 3 },
            { target: "Garrison Army", type: "item", value: 3 },
            { target: "Recover Army", type: "item", value: 3 },
            { target: "Recruit Army", type: "item", value: 3 }
        ],
        effects: "Can only be built in capital. Reduce Unrest by 10 when built. Ruler gains +3 item bonus to Leadership activities."
    },
    {
        name: "Stockyard",
        level: 3,
        traits: ["Yard"],
        lots: [2, 2],
        cost: { rp: 20, lumber: 4 },
        construction: { skill: "Industry", rank: "trained", dc: 18 },
        itemBonus: [{ target: "Gather Livestock", type: "item", value: 1 }],
        consumptionMod: -1,
        effects: "Reduces the settlement’s Consumption by 1."
    },
    {
        name: "University",
        level: 15,
        traits: ["Building", "Edifice", "Famous"],
        lots: [2, 2],
        cost: { rp: 78, lumber: 18, luxuries: 18, stone: 18 },
        construction: { skill: "Scholarship", rank: "master", dc: 34 },
        upgradeFrom: ["Academy"],
        itemBonus: [{ target: "Creative Solution", type: "item", value: 3 }],
        effects: "Gain a +3 item bonus to certain Lore, Researching, and Decipher Writing checks."
    },
    {
        name: "Waterfront",
        level: 8,
        traits: ["Yard"],
        lots: [2, 2],
        cost: { rp: 90, lumber: 10 },
        construction: { skill: "Boating", rank: "expert", dc: 24 },
        upgradeFrom: ["Pier"],
        itemBonus: [
            { target: "Go Fishing", type: "item", value: 1 },
            { target: "Establish Trade Agreement (Boating)", type: "item", value: 1 },
            { target: "Rest and Relax (Boating)", type: "item", value: 1 }
        ],
        effects: "Must be built next to a Water Border. Increases settlement's effective level by 1 for item availability."
    },

    // --- INFRASTRUCTURE ---
    {
        name: "Bridge",
        level: 2,
        traits: ["Infrastructure"],
      lots: [0, 0],
        cost: { rp: 6, lumber: 1, stone: 1 }, // Rulebook says or, but we combine for simplicity of data.
        construction: { skill: "Engineering", rank: "trained", dc: 16 },
        effects: "Allows an island settlement to provide influence and negates its Trade penalty."
    },
    {
        name: "Magical Streetlamps",
        level: 5,
        traits: ["Infrastructure"],
lots: [0, 0],
        cost: { rp: 20 },
        construction: { skill: "Magic", rank: "expert", dc: 20 },
        effects: "Provides nighttime illumination. First time built in a turn, reduce Crime by 1."
    },
    {
        name: "Paved Streets",
        level: 4,
        traits: ["Infrastructure"],
lots: [0, 0],
        cost: { rp: 12, stone: 6 },
        construction: { skill: "Industry", rank: "trained", dc: 19 },
        effects: "Reduces travel time within the settlement's Urban Grid."
    },
    {
        name: "Sewer System",
        level: 7,
        traits: ["Infrastructure"],
lots: [0, 0],
        cost: { rp: 24, lumber: 8, stone: 8 },
        construction: { skill: "Engineering", rank: "expert", dc: 23 },
        itemBonus: [{ target: "Clandestine Business", type: "item", value: 1 }],
        consumptionMod: -1,
        effects: "Reduces the settlement’s Consumption by 1."
    },
    {
        name: "Wall, Stone",
        level: 5,
        traits: ["Infrastructure"],
lots: [0, 0],
        cost: { rp: 4, stone: 8 },
        construction: { skill: "Defense", rank: "trained", dc: 20 },
        upgradeFrom: ["Wall, Wooden"],
        effects: "Built along one border of a settlement. First time built in each settlement, reduce Unrest by 1."
    },
    {
        name: "Wall, Wooden",
        level: 1,
        traits: ["Infrastructure"],
lots: [0, 0],
        cost: { rp: 2, lumber: 4 },
        construction: { skill: "Defense", rank: "trained", dc: 15 },
        upgradeTo: ["Wall, Stone"],
        effects: "Built along one border of a settlement. First time built in each settlement, reduce Unrest by 1."
    }
];

const ACTIVITY_TO_SKILL_MAP = {
    "Demolish": "Engineering",
    "Quell Unrest (Magic)": "Magic",
    "Establish Trade Agreement": "Trade", // Can also be Boating/Magic, simplified to Trade for bonuses
    "Garrison Army": "Defense", // Can use multiple skills, but Defense is a good general fit for bonuses
    "Recover Army": "Defense",
    "Recruit Army": "Warfare",
    "Tap Treasury": "Statecraft",
    "Creative Solution": "Scholarship",
    "Quell Unrest (Intrigue)": "Intrigue",
    "Provide Care": "Defense",
    "Rest and Relax (Scholarship)": "Scholarship",
    "Supernatural Solution": "Magic",
    "Improve Lifestyle": "Politics",
    "Establish Work Site (Mine)": "Industry",
    "Train Army": "Warfare",
    "Outfit Army": "Warfare",
    "Pledge of Fealty (Warfare)": "Warfare",
    "Celebrate Holiday": "Folklore",
    "Create a Masterpiece": "Arts",
    "Send Diplomatic Envoy": "Statecraft",
    "Request Foreign Aid": "Statecraft",
    "Clandestine Business": "Intrigue",
    "Repair Reputation (Decay)": "Engineering",
    "Repair Reputation (Crime)": "Trade",
    "Repair Reputation (Corruption)": "Arts",
    "Repair Reputation (Strife)": "Intrigue",
    "Infiltration": "Intrigue",
    "Prognostication": "Magic",
    "Go Fishing": "Boating",
    "Harvest Crops": "Agriculture",
    "Gather Livestock": "Wilderness",
    "Purchase Commodities": "Trade",
    "Craft Luxuries": "Arts",
    "Establish Work Site (Lumber Camp)": "Industry",
    "Establish Work Site (Quarry)": "Industry",
    "Rest and Relax (Wilderness)": "Wilderness",
    "Rest and Relax (Trade)": "Trade",
    "Resolve Settlement Event": "Defense" // Generalizing this bonus
};

const DEFAULT_KINGDOM_DATA = {
  name: "Silverwood",
  level: 1,
  xp: 0,
  size: 1,
  farmlandHexes: 0,
  capital: "Stag's Rest",
  fame: 1,
  infamy: 0,
  unrest: 0,
  baseCulture: 10,
  baseEconomy: 10,
  baseLoyalty: 10,
  baseStability: 10,
  food: 5,
  lumber: 5,
  luxuries: 5,
  ore: 5,
  stone: 5,
  treasury: 10,
  ruins: {
    corruption: { points: 0, penalty: 0, threshold: 10 },
    crime: { points: 0, penalty: 0, threshold: 10 },
    decay: { points: 0, penalty: 0, threshold: 10 },
    strife: { points: 0, penalty: 0, threshold: 10 },
  },
  concept: "A frontier kingdom seeking to tame the wilds.",
  charter: "Conquest",
  heartland: "Forest",
  government: "Feudalism",
  eventCheckModifier: 0,
  resourceDice: 0,
  tradeAgreements: "",
  leaders: {
    ruler: { name: "Queen Anya", isInvested: true, status: "PC" },
    counselor: { name: "Elara", isInvested: true, status: "NPC" },
    general: { name: "Garrus", isInvested: true, status: "Hired" },
    emissary: { name: "Lysandra", isInvested: false, status: "Hired" },
    magister: { name: "Zeke", isInvested: false, status: "Hired" },
    treasurer: { name: "", isInvested: false, status: "Vacant" },
    viceroy: { name: "", isInvested: false, status: "Vacant" },
    warden: { name: "", isInvested: false, status: "Vacant" },
  },
  settlements: [],
  armies: [],
  advancement: {},
  skills: {},
};

// ==========================================
// UTILITIES & HELPERS
// ==========================================

const ModalCleanup = {
    closeAllModals() {
        const openModals = document.querySelectorAll('.uk-modal.uk-open');
        openModals.forEach(modal => {
            try {
                UIkit.modal(modal).hide();
            } catch (e) {
                // If UIkit fails, try manual cleanup
                modal.classList.remove('uk-open');
                modal.style.display = 'none';
            }
        });
    },
    
    // Call this before showing any new modal to prevent stacking
    ensureCleanState() {
        this.closeAllModals();
        // Also remove any lingering backdrop elements
        const backdrops = document.querySelectorAll('.uk-modal-page');
        backdrops.forEach(backdrop => {
            backdrop.classList.remove('uk-modal-page');
        });
    }
};

const ErrorHandler = {
  withErrorHandling(fn, context = "Operation") {
    try {
      return fn();
    } catch (error) {
      console.error(`${context} failed:`, error);
      UIkit.notification({
        message: `${context} failed: ${error.message}`,
        status: "danger",
        pos: "top-center",
        timeout: CONFIG.NOTIFICATION_TIMEOUT,
      });
      return null;
    }
  },

  showError(message) {
    UIkit.notification({ 
      message, 
      status: "danger", 
      pos: "top-center",
      timeout: CONFIG.NOTIFICATION_TIMEOUT
    });
  },

  showSuccess(message) {
    UIkit.notification({ 
      message, 
      status: "success", 
      pos: "top-center",
      timeout: CONFIG.NOTIFICATION_TIMEOUT
    });
  }
};

const Validators = {
  isPositiveInteger: (value) => Number.isInteger(value) && value >= 0,
  isValidRange: (value, min, max) => value >= min && value <= max,
  isNotEmpty: (value) => value && value.toString().trim().length > 0,
  isLength: (value, max) => value.length <= max,

  validateKingdomName: (name) => {
    if (!Validators.isNotEmpty(name)) throw new Error("Kingdom name cannot be empty.");
    if (!Validators.isLength(name, 50)) throw new Error("Kingdom name must be 50 characters or less.");
    return true;
  },

  validateLevel: (level) => {
    if (!Validators.isPositiveInteger(level)) throw new Error("Level must be a positive integer.");
    if (!Validators.isValidRange(level, 1, 20)) throw new Error("Level must be between 1 and 20.");
    return true;
  },

  validateResource: (value, resourceName) => {
    if (!Number.isInteger(value)) throw new Error(`${resourceName} must be a whole number.`);
    if (value < 0) throw new Error(`${resourceName} cannot be negative.`);
    return true;
  },
};

function validateAndExecute(element, validator, onSuccess) {
  try {
    const value = element.type === "number" ? parseInt(element.value, 10) : element.value;
    if (validator(value)) {
      onSuccess(value);
    }
  } catch (error) {
    ErrorHandler.showError(error.message);
    element.classList.add("uk-form-danger");
    setTimeout(() => element.classList.remove("uk-form-danger"), 3000);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==========================================
// SERVICES
// ==========================================

const KingdomService = {
  calculateStructureBonuses() {
    const aggregatedBonuses = {
        skillBonuses: {}, // e.g., { Arts: 1, Intrigue: 2, ... }
        consumptionMod: 0,
        storage: { food: 0, lumber: 0, luxuries: 0, ore: 0, stone: 0 }
    };

    if (!kingdom.settlements) return aggregatedBonuses;
    
    // Initialize skillBonuses for all skills
    for (const skillName in KINGDOM_SKILLS) {
        aggregatedBonuses.skillBonuses[skillName] = 0;
    }

    kingdom.settlements.forEach(settlement => {
        // Initialize per-settlement bonuses
        const settlementBonuses = {};
        for (const skillName in KINGDOM_SKILLS) {
            settlementBonuses[skillName] = 0;
        }

        // Iterate through all built structures in the settlement
        const builtStructures = settlement.lots
            .filter(lot => lot.isOrigin && lot.structureName)
            .map(lot => AVAILABLE_STRUCTURES.find(s => s.name === lot.structureName))
            .filter(Boolean); // Filter out any undefined structures

        // Also check for infrastructure
        // This is a simplified check; a more robust one would pull from the AVAILABLE_STRUCTURES array
        if(settlement.infrastructure && settlement.infrastructure.sewerSystem) {
             aggregatedBonuses.consumptionMod -= 1;
        }

        builtStructures.forEach(structure => {
            // Aggregate specific item bonuses to their corresponding SKILL
            if (structure.itemBonus) {
                structure.itemBonus.forEach(bonus => {
                    const skillName = ACTIVITY_TO_SKILL_MAP[bonus.target];
                    if (skillName) {
                        settlementBonuses[skillName] += bonus.value;
                    }
                });
            }

            // Aggregate consumption modifiers
            if (structure.consumptionMod) {
                aggregatedBonuses.consumptionMod += structure.consumptionMod;
            }

            // Aggregate storage modifiers
            if (structure.storageMod) {
                const type = structure.storageMod.type.toLowerCase();
                if (aggregatedBonuses.storage.hasOwnProperty(type)) {
                    aggregatedBonuses.storage[type] += structure.storageMod.value;
                }
            }
        });

        // Cap item bonuses based on settlement type
        const maxItemBonus = this.getSettlementMaxItemBonus(settlement);
        for (const skill in settlementBonuses) {
            aggregatedBonuses.skillBonuses[skill] += Math.min(settlementBonuses[skill], maxItemBonus);
        }
    });

    return aggregatedBonuses;
  },

  calculateConsumption() {
    let totalConsumption = 0;
    const bonuses = this.calculateStructureBonuses(); // Get all bonuses

    // Base consumption from settlements
    kingdom.settlements.forEach(settlement => {
        const builtBlocks = new Set(
            settlement.lots
                .map((lot, idx) => ({ lotIndex: idx, structureName: lot.structureName }))
                .filter(l => l.structureName)
                .map(l => Math.floor(l.lotIndex / 4))
        ).size;

        let settlementBaseConsumption = 1; // Default Village
        if (builtBlocks >= 10) settlementBaseConsumption = 6; // Metropolis (10+ blocks)
        else if (builtBlocks >= 9) settlementBaseConsumption = 4; // City (9 blocks)
        else if (builtBlocks >= 4) settlementBaseConsumption = 2; // Town (4 blocks)
        totalConsumption += settlementBaseConsumption;
    });

    // Apply all modifiers at the kingdom level
    totalConsumption += bonuses.consumptionMod; // From all structures (Mills, Stockyards, Sewers)
    totalConsumption += kingdom.armies.reduce((total, army) => total + (army.consumption || 0), 0);
    totalConsumption -= kingdom.farmlandHexes || 0;
    totalConsumption += turnData.turnConsumptionModifier || 0; // From turn-specific events
    
    return { food: Math.max(0, totalConsumption) };
  },

  calculateSkillModifiers() {
    const skillData = JSON.parse(JSON.stringify(kingdom.skills));
    // Get the new comprehensive bonus object
    const aggregatedBonuses = this.calculateStructureBonuses();

    // Calculate penalties
    let unrestPenalty = kingdom.unrest >= 15 ? 4 : kingdom.unrest >= 10 ? 3 : kingdom.unrest >= 5 ? 2 : kingdom.unrest >= 1 ? 1 : 0;
    let rulerVacancyCheckPenalty = (kingdom.leaders?.ruler?.status === "Vacant") ? 1 : 0;

    // Handle skill increases from leveling up
    for (const skillName in skillData) {
        if (!skillData[skillName].prof) skillData[skillName].prof = 0;
    }
    for (let i = 2; i <= kingdom.level; i++) {
        const skillName = kingdom.advancement[`lvl${i}`]?.skillIncrease;
        if (skillName && skillData[skillName] && skillData[skillName].prof < PROFICIENCY_RANKS.length - 1) {
            skillData[skillName].prof++;
        }
    }

    const finalMods = {};
    for (const skillName in skillData) {
        const skill = skillData[skillName];
        const ability = KINGDOM_SKILLS[skillName];
        
        // Note: Ability score bonuses from structures are no longer used. This is correct as per the rules.
        // The rulebook gives specific item bonuses to activities, not flat ability score increases.
        const abilityScore = kingdom[`base${ability.charAt(0).toUpperCase() + ability.slice(1)}`];
        
        const abilityMod = this.getAbilityModifier(abilityScore);
        const profBonus = skill.prof > 0 ? kingdom.level + 2 * skill.prof : 0;

        // ===================================================================
        // MODIFIED: Get the total item bonus from the new aggregatedBonuses object
        // and add the manually entered item bonus from the skill data.
        // ===================================================================
        const structureItemBonus = aggregatedBonuses.skillBonuses[skillName] || 0;
        const totalItemBonus = structureItemBonus + (skill.item || 0);

        const ruinMap = { culture: "corruption", economy: "crime", loyalty: "strife", stability: "decay" };
        const ruinPenalty = kingdom.ruins[ruinMap[ability]]?.penalty || 0;
        
        const turnCircumstanceBonus = turnData[`turn${ability.charAt(0).toUpperCase() + ability.slice(1)}CircumstanceBonus`] || 0;
        const totalCirc = (skill.circ || 0) + turnCircumstanceBonus + (turnData.turnGenericCircumstanceBonus || 0);

        finalMods[skillName] = abilityMod + profBonus + totalItemBonus - ruinPenalty + (skill.status || 0) + totalCirc - unrestPenalty - rulerVacancyCheckPenalty;
    }
    return finalMods;
  },

calculateControlDC() {
    const levelDC = KINGDOM_ADVANCEMENT_TABLE.find(row => row.level === kingdom.level)?.dc || 14;
    const sizeMod = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max)?.mod || 0;
    
    let rulerVacancyPenalty = 0;
    if (kingdom.leaders && kingdom.leaders.ruler && kingdom.leaders.ruler.status === "Vacant") {
        rulerVacancyPenalty = 2;
    }
    
    // Add the penalty to the final DC.
    return levelDC + sizeMod + rulerVacancyPenalty;
},

  getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  },

  checkFeatPrerequisites(feat) {
    if (!feat.prereq) return true;

    if (feat.prereq.skill) {
      return kingdom.skills[feat.prereq.skill]?.prof >= feat.prereq.rank;
    }
    if (feat.prereq.ability) {
      const bonuses = this.calculateStructureBonuses();
      const abilityScore = kingdom[`base${feat.prereq.ability.charAt(0).toUpperCase() + feat.prereq.ability.slice(1)}`] + (bonuses[feat.prereq.ability] || 0);
      return abilityScore >= feat.prereq.value;
    }
    if (feat.prereq.trainedSkills) {
      const trainedCount = Object.values(kingdom.skills).filter(s => s.prof >= 1).length;
      return trainedCount >= feat.prereq.trainedSkills;
    }
    return true;
  },

  updateRuin(ruinType, amount) {
    if (!kingdom.ruins[ruinType] || amount === 0) return;
    const ruin = kingdom.ruins[ruinType];
    ruin.points += amount;
    while (ruin.points >= ruin.threshold) {
      ruin.penalty++;
      ruin.points -= ruin.threshold;
      UIkit.notification({
        message: `<span uk-icon='icon: warning'></span> ${ruinType.charAt(0).toUpperCase() + ruinType.slice(1)} penalty has increased to ${ruin.penalty}!`,
        status: "danger",
      });
    }
    if (ruin.points < 0) ruin.points = 0;
  },

  getSettlementMaxItemBonus(settlement) {
    const blockIndices = new Set();
    settlement.lots.forEach((lot, idx) => {
      if (lot.structureName) {
        blockIndices.add(Math.floor(idx / settlement.gridSize));
      }
    });
    const blocks = blockIndices.size;
    if (blocks >= 10) return 3; // Metropolis
    if (blocks >= 9) return 2;  // City
    return 1; // Village or Town
  },

  isSettlementOvercrowded(settlement) {
    const residentialLots = settlement.lots.reduce((count, lot) => {
      if (!lot.structureName) return count;
      const structure = AVAILABLE_STRUCTURES.find(s => s.name === lot.structureName);
      return structure && structure.traits && structure.traits.includes('Residential') ? count + 1 : count;
    }, 0);

    const builtBlockIndices = new Set();
    settlement.lots.forEach((lot, idx) => {
      if (lot.structureName) {
        builtBlockIndices.add(Math.floor(idx / settlement.gridSize));
      }
    });
    const builtBlocks = builtBlockIndices.size;

    return residentialLots < builtBlocks;
  }
};

const SaveService = {
  save() {
    return ErrorHandler.withErrorHandling(() => {
      const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
      if (fullState && fullState.kingdoms && fullState.activeKingdomId) {
        fullState.kingdoms[fullState.activeKingdomId] = {
          kingdom,
          history,
          turnData
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
      }
      return true;
    }, "Failed to save kingdom data");
  },

  load() {
    const savedState = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedState) {
      try {
        let appState = JSON.parse(savedState);
        
        if (!appState.kingdoms || !appState.activeKingdomId) {
          const oldKingdomData = {
            kingdom: appState.kingdom,
            history: appState.history,
            turnData: appState.turnData,
          };
          const newKingdomId = `k_${Date.now()}`;
          appState = {
            activeKingdomId: newKingdomId,
            kingdoms: { [newKingdomId]: oldKingdomData }
          };
        }
        
        const activeKingdomData = appState.kingdoms[appState.activeKingdomId];

        if (activeKingdomData) {
          kingdom = activeKingdomData.kingdom;
          history = activeKingdomData.history || [];
          turnData = activeKingdomData.turnData || {};
          turnData.claimHexAttempts = turnData.claimHexAttempts || 0;
          turnData.leadershipActivitiesUsed = turnData.leadershipActivitiesUsed || 0;
          turnData.regionActivitiesUsed = turnData.regionActivitiesUsed || 0;
          turnData.civicActivitiesUsed = turnData.civicActivitiesUsed || 0;
        } else {
          const firstKingdomId = Object.keys(appState.kingdoms)[0];
          if (firstKingdomId) {
            appState.activeKingdomId = firstKingdomId;
            this.load();
          } else {
            this.initializeDefaultKingdom();
          }
        }
      } catch (error) {
        console.error("Failed to load saved state:", error);
        UIkit.modal.confirm("Failed to load saved data. Start with a new kingdom?").then(() => {
          this.initializeDefaultKingdom();
        });
      }
    } else {
      this.initializeDefaultKingdom();
    }
  },

  initializeDefaultKingdom() {
    const newKingdomId = `k_${Date.now()}`;
    const newKingdomData = JSON.parse(JSON.stringify(DEFAULT_KINGDOM_DATA));
    newKingdomData.advancement = DataService.generateDefaultAdvancement();
    newKingdomData.skills = DataService.generateDefaultSkills();

    const initialAppState = {
      activeKingdomId: newKingdomId,
      kingdoms: {
        [newKingdomId]: {
          kingdom: newKingdomData,
          history: [],
          turnData: {
            claimHexAttempts: 0,
            leadershipActivitiesUsed: 0,
            regionActivitiesUsed: 0,
            civicActivitiesUsed: 0
          }
        }
      }
    };

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(initialAppState));
    this.load();
  },

  export() {
    const dataStr = JSON.stringify({ kingdom, history, turnData, version: CONFIG.VERSION }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kingdom.name || "kingdom"}-save.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    ErrorHandler.showSuccess("Save file exported.");
  },

  import() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        ErrorHandler.withErrorHandling(() => {
          const loadedState = JSON.parse(event.target.result);

          // Step 1: Validate the imported file structure
          if (!loadedState.kingdom || !loadedState.history) {
            throw new Error("Invalid save file. The file must contain kingdom and history data.");
          }
          ModalCleanup.ensureCleanState();

          // Step 2: Show a modal asking the user what to do with the imported data
          const modalContent = `
            <div class="uk-modal-body">
              <h2 class="uk-modal-title">Import Kingdom: ${loadedState.kingdom.name || 'Unnamed Kingdom'}</h2>
              <p>How would you like to import this kingdom?</p>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button class="uk-button uk-button-danger" id="import-overwrite-btn" type="button">Overwrite Current</button>
                <button class="uk-button uk-button-primary" id="import-new-btn" type="button">Import as New</button>
            </div>
          `;
          const modal = UIkit.modal.dialog(modalContent);

modal.$el.addEventListener('hide', () => {
              setTimeout(() => {
                  ModalCleanup.ensureCleanState();
              }, 300);
          });

          // Step 3: Add event listeners for the modal buttons
          modal.$el.querySelector('#import-overwrite-btn').addEventListener('click', () => {
              ErrorHandler.withErrorHandling(() => {
                  kingdom = loadedState.kingdom;
                  history = loadedState.history;
                  turnData = loadedState.turnData || {};
                  this.save(); // Saves over the currently active kingdom slot
                  UI.renderAll();
                  TurnService.clearTurn();
                  modal.hide();
                  ErrorHandler.showSuccess(`"${kingdom.name}" successfully overwritten.`);
              }, "Overwrite Failed");
          });
          
          modal.$el.querySelector('#import-new-btn').addEventListener('click', () => {
              ErrorHandler.withErrorHandling(() => {
                  const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
                  const newKingdomId = `k_${Date.now()}`;

                  // Add the imported kingdom as a new entry
                  fullState.kingdoms[newKingdomId] = {
                      kingdom: loadedState.kingdom,
                      history: loadedState.history,
                      turnData: loadedState.turnData || {}
                  };
                  
                  // Set it as the active kingdom
                  fullState.activeKingdomId = newKingdomId;
                  
                  // Save the entire state and reload the application
                  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                  modal.hide();
                  ErrorHandler.showSuccess(`"${loadedState.kingdom.name}" imported as a new kingdom! Reloading...`);
                  setTimeout(() => window.location.reload(), 1000);
              }, "Import as New Failed");
          });

        }, "Error processing imported file");
      };
      reader.readAsText(file);
    };
    input.click();
  },

  createNewKingdom() {
    const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
    const newKingdomId = `k_${Date.now()}`;

    const newKingdomData = JSON.parse(JSON.stringify(DEFAULT_KINGDOM_DATA));
    newKingdomData.advancement = DataService.generateDefaultAdvancement();
    newKingdomData.skills = DataService.generateDefaultSkills();

    fullState.kingdoms[newKingdomId] = {
      kingdom: newKingdomData,
      history: [],
      turnData: {}
    };

    fullState.activeKingdomId = newKingdomId;
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
    window.location.reload();
  },

  resetAllKingdoms() {
    UIkit.modal.confirm("Are you sure? This will erase ALL saved kingdoms and start a new one.").then(() => {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      this.initializeDefaultKingdom();
      UI.renderAll();
      TurnService.clearTurn();
      ErrorHandler.showSuccess("All kingdoms have been reset.");
    });
  }
};

const DataService = {
  generateDefaultAdvancement() {
    const advancement = {};
    for (let i = 2; i <= 20; i++) {
      advancement[`lvl${i}`] = {};
      if (i % 2 === 0) advancement[`lvl${i}`].feat = "";
      if (i % 5 === 0) advancement[`lvl${i}`].abilityBoosts = "";
      if (i >= 3 && i % 2 !== 0) advancement[`lvl${i}`].skillIncrease = "";
      if ([5, 8, 11, 14, 17].includes(i)) advancement[`lvl${i}`].ruinResistance = "";
    }
    return advancement;
  },

  generateDefaultSkills() {
    const skills = {};
    for (const skillName in KINGDOM_SKILLS) {
      skills[skillName] = { prof: 0, item: 0, status: 0, circ: 0, other: 0 };
    }
    return skills;
  }
};

const TurnService = {
  clearTurn() {
    turnData = {
      turnFame: kingdom.fame + 1,
      turnUnrest: kingdom.unrest,
      turnResourcePoints: 0,
      turnXP: 0,
      currentNotes: "",
      currentEvent: "",
      rolledResources: false,
      paidConsumption: false,
      appliedUnrest: false,
      eventChecked: false,
      claimHexAttempts: 0,
      leadershipActivitiesUsed: 0,
      regionActivitiesUsed: 0,
      civicActivitiesUsed: 0
    };
    for (const category in KINGDOM_ACTIVITIES) {
      KINGDOM_ACTIVITIES[category].forEach(activityName => {
        const key = `activity_${activityName.replace(/\s+/g, '_')}`;
        turnData[key] = false;
      });
    }
    UI.renderTurnTracker();
  },

  saveTurn() {
    UIkit.modal.confirm("Are you sure you want to end the turn and save?").then(() => {
      ErrorHandler.withErrorHandling(() => {
        const consumption = KingdomService.calculateConsumption();
        kingdom.food = Math.max(0, kingdom.food - consumption.food);
        kingdom.xp = Math.min(CONFIG.XP_CAP, kingdom.xp + (turnData.turnXP || 0));
        kingdom.unrest = turnData.turnUnrest || 0;
        kingdom.fame = turnData.turnFame || 0;
        kingdom.treasury += turnData.turnResourcePoints || 0;

        KingdomService.updateRuin("corruption", turnData.turnCorruption || 0);
        KingdomService.updateRuin("crime", turnData.turnCrime || 0);
        KingdomService.updateRuin("decay", turnData.turnDecay || 0);
        KingdomService.updateRuin("strife", turnData.turnStrife || 0);

        const historyEntry = { ...turnData, kingdomLevel: kingdom.level, foodConsumed: consumption.food };
        history.unshift(historyEntry);
        if (history.length > CONFIG.MAX_HISTORY_ENTRIES) history.pop();

        SaveService.save();
        this.clearTurn();
        UI.renderAll();
        ErrorHandler.showSuccess("Turn saved successfully.");
      }, "Error saving turn");
    });
  },

  rollResources() {
    const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || KINGDOM_SIZE_TABLE[0];
    const dieType = sizeData.die;
    const numDice = kingdom.level + 4 + (turnData.turnBonusResourceDice || 0) - (turnData.turnPenaltyResourceDice || 0);

    let totalRP = 0;
    for (let i = 0; i < numDice; i++) {
      totalRP += Math.floor(Math.random() * dieType) + 1;
    }

    turnData.turnResourcePoints = totalRP;
    turnData.rolledResources = true;

    UI.renderTurnTracker();
    ErrorHandler.showSuccess(`You generated ${totalRP} RP for this turn!`);
  },

  payConsumption() {
    const consumption = KingdomService.calculateConsumption().food;
    if (turnData.paidConsumption) return;

    if (kingdom.food >= consumption) {
      kingdom.food -= consumption;
      turnData.paidConsumption = true;
      UI.renderAll();
      ErrorHandler.showSuccess(`Paid ${consumption} Food for consumption.`);
    } else {
      const foodShortage = consumption - kingdom.food;
      const rpCost = foodShortage * 5;

      UIkit.modal.confirm(`You are short ${foodShortage} Food. Pay with ${rpCost} RP instead? (If you decline, Unrest will increase).`).then(
        () => {
          if (turnData.turnResourcePoints >= rpCost) {
            kingdom.food = 0;
            turnData.turnResourcePoints -= rpCost;
            turnData.paidConsumption = true;
            UI.renderAll();
            ErrorHandler.showSuccess(`Paid for the shortfall with ${rpCost} RP.`);
          } else {
            UIkit.modal.alert(`You do not have enough RP. You must suffer the Unrest penalty.`);
            const unrestGain = Math.floor(Math.random() * 4) + 1;
            turnData.turnUnrest += unrestGain;
            turnData.paidConsumption = true;
            UI.renderAll();
          }
        },
        () => {
          const unrestGain = Math.floor(Math.random() * 4) + 1;
          turnData.turnUnrest += unrestGain;
          turnData.paidConsumption = true;
          UI.renderAll();
          UIkit.notification({ message: `Declined to pay with RP. Gained ${unrestGain} Unrest.`, status: 'warning' });
        }
      );
    }
  },

  applyUpkeepEffects() {
    if (kingdom.leaders && kingdom.leaders.ruler && kingdom.leaders.ruler.status === "Vacant") {
        const unrestGain = Math.floor(Math.random() * 4) + 1;
        turnData.turnUnrest += unrestGain;
        UIkit.notification({
            message: `<span uk-icon='icon: warning'></span> Ruler is vacant! Gained ${unrestGain} Unrest.`,
            status: 'danger'
        });
    }
    let overcrowdingUnrest = 0;
    kingdom.settlements.forEach(settlement => {
      if (KingdomService.isSettlementOvercrowded(settlement)) {
        overcrowdingUnrest++;
      }
    });
    if (overcrowdingUnrest > 0) {
      turnData.turnUnrest += overcrowdingUnrest;
      UIkit.notification({ message: `Gained ${overcrowdingUnrest} Unrest from overcrowded settlements.`, status: 'warning' });
    }

    if (turnData.turnUnrest >= 10) {
      const ruinPoints = Math.floor(Math.random() * 10) + 1;
      UIkit.modal.alert(`Your Unrest is ${turnData.turnUnrest}! You gain ${ruinPoints} Ruin points to distribute among your ruins.`).then(() => {
        KingdomService.updateRuin('corruption', ruinPoints);
        UIkit.notification({ message: `${ruinPoints} Ruin points added to Corruption.`, status: 'danger' });
        
        const flatCheck = Math.floor(Math.random() * 20) + 1;
        if (flatCheck < 11) {
          UIkit.modal.alert(`You rolled a ${flatCheck} on a DC 11 flat check due to high Unrest. Your kingdom loses a hex! You must manually reduce your kingdom's Size.`);
          kingdom.size = Math.max(0, kingdom.size - 1);
        } else {
          UIkit.modal.alert(`You rolled a ${flatCheck} on a DC 11 flat check due to high Unrest. You successfully avoided losing a hex.`);
        }
      });
    }
    
    if (turnData.turnUnrest >= 20) {
      UIkit.notification({ message: `Your kingdom has fallen into Anarchy! The results of all kingdom checks are worsened one degree.`, status: 'danger', timeout: 6000 });
    }

    turnData.appliedUnrest = true;
    UI.renderAll();
  },

  checkForEvent() {
    const eventCheckDC = 16 - (kingdom.eventCheckModifier || 0);
    const d20Roll = Math.floor(Math.random() * 20) + 1;

    if (d20Roll < eventCheckDC) {
      kingdom.eventCheckModifier += 5;
      UIkit.notification({ message: `No event this turn (Rolled ${d20Roll} vs DC ${eventCheckDC}).` });
    } else {
      kingdom.eventCheckModifier = 0;
      const d100Roll = Math.floor(Math.random() * 100) + 1;
      const event = RANDOM_KINGDOM_EVENTS.find(e => d100Roll >= e.min && d100Roll <= e.max);
      
      if (event) {
        turnData.currentEvent = event.name;
        UIkit.modal.alert(`<h4>Event! (d100 = ${d100Roll})</h4><p>Your kingdom experiences the following event: <strong>${event.name}</strong></p>`);
      }
    }
    
    turnData.eventChecked = true;
    SaveService.save();
    UI.renderTurnTracker();
  },

  getCapitalStructures() {
    const capitalSettlement = kingdom.settlements?.find(s => s.name === kingdom.capital);
    if (!capitalSettlement) return [];
    return capitalSettlement.lots
      .filter(l => l.isOrigin && l.structureName)
      .map(l => l.structureName);
  },

  canAttemptClaimHex() {
    const base = Math.max(1, Math.ceil(kingdom.level / 5));
    return turnData.claimHexAttempts < base;
  },

  canAttemptLeadershipActivity() {
    let allowed = 2 + Math.floor((kingdom.level - 1) / 10);
    const structures = this.getCapitalStructures();
    if (structures.some(s => ["Town Hall", "Castle", "Palace"].includes(s))) {
      allowed += 1;
    }
    return turnData.leadershipActivitiesUsed < allowed;
  },

  canAttemptRegionActivity() {
    const allowed = 1 + Math.floor((kingdom.level - 1) / 5);
    return turnData.regionActivitiesUsed < allowed;
  },

  canAttemptCivicActivity() {
    let allowed = 1 + Math.floor((kingdom.level - 1) / 10);
    const structures = this.getCapitalStructures();
    if (structures.includes("Construction Yard")) allowed += 1;
    return turnData.civicActivitiesUsed < allowed;
  }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

let kingdom = {};
let turnData = {};
let history = [];
let isCreationMode = false;

// ==========================================
// UI RENDERING COMPONENTS
// ==========================================

const KingdomRenderer = {
  // NEW: Renders the top-level dashboard header.
  renderHeader(kingdom, controlDC, unrestPenalty) {
    const xpPercent = Math.min(100, Math.floor((kingdom.xp / CONFIG.XP_CAP) * 100));
    let unrestClass = "";
    if (unrestPenalty >= 4) unrestClass = "uk-text-danger uk-text-bold";
    else if (unrestPenalty >= 2) unrestClass = "uk-text-warning uk-text-bold";

    return `
      <div class="uk-card uk-card-body uk-card-default uk-margin-bottom">
        <div class="uk-grid-small uk-flex-middle" uk-grid>
          <div class="uk-width-expand">
            <h3 class="uk-card-title uk-margin-remove-bottom">${kingdom.name}</h3>
            <p class="uk-text-meta uk-margin-remove-top">Level ${kingdom.level} | ${kingdom.government || 'N/A'} of ${kingdom.capital || 'N/A'}</p>
          </div>
          <div class="uk-width-auto">
            <span class="uk-text-large">Control DC: ${controlDC}</span>
          </div>
          <div class="uk-width-auto">
            <span class="uk-text-large ${unrestClass}">Unrest: ${kingdom.unrest} (Penalty: -${unrestPenalty})</span>
          </div>
        </div>
        <progress class="uk-progress uk-margin-small-top" value="${xpPercent}" max="100" uk-tooltip="title: ${kingdom.xp} / ${CONFIG.XP_CAP} XP"></progress>
      </div>`;
  },

  // NEW: Renders a combined card for Abilities and their opposing Ruins.
  renderAbilitiesAndRuins(kingdom) {
    const abilities = ["Culture", "Economy", "Loyalty", "Stability"];
    const ruinMap = { Culture: "corruption", Economy: "crime", Loyalty: "strife", Stability: "decay" };

    return abilities.map(ability => {
      const score = kingdom[`base${ability}`];
      const modifier = KingdomService.getAbilityModifier(score);
      const ruin = kingdom.ruins[ruinMap[ability].toLowerCase()];

      return `
        <div>
          <h5 class="uk-text-bold uk-margin-remove">${ability}</h5>
          <span class="uk-text-large">${score}</span>
          <span class="uk-text-primary uk-text-bold">(${modifier >= 0 ? '+' : ''}${modifier})</span>
          <hr class="uk-margin-small">
          <div class="uk-text-meta">
            ${ruinMap[ability]}: ${ruin.points}/${ruin.threshold}
            <span class="uk-text-danger" uk-tooltip="Item penalty to all ${ability}-based checks"> (Penalty: -${ruin.penalty})</span>
          </div>
        </div>`;
    }).join('');
  },

  // MODIFIED: Renders the resources card, now including storage limits.
  renderResources(kingdom) {
    const resources = ["food", "lumber", "luxuries", "ore", "stone"];
    const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || { storage: 4 };
    const bonuses = KingdomService.calculateStructureBonuses();

    let treasuryHtml = `
        <div class="resource-item">
            <span class="resource-label uk-text-capitalize">Treasury (RP): ${kingdom.treasury}</span>
            <button class="uk-button uk-button-default uk-button-small" data-resource="treasury" data-action="decrease">-</button>
            <input class="uk-input uk-form-width-small uk-form-small" type="number" data-resource="treasury" value="${kingdom.treasury}">
            <button class="uk-button uk-button-default uk-button-small" data-resource="treasury" data-action="increase">+</button>
        </div><hr>`;

    let commoditiesHtml = resources.map(res => {
      const maxStorage = sizeData.storage + (bonuses.storage[res] || 0);
      return `<div class="resource-item">
          <span class="resource-label uk-text-capitalize">${res}: ${kingdom[res]} / ${maxStorage}</span>
          <button class="uk-button uk-button-default uk-button-small" data-resource="${res}" data-action="decrease">-</button>
          <input class="uk-input uk-form-width-small uk-form-small" type="number" data-resource="${res}" value="${kingdom[res]}">
          <button class="uk-button uk-button-default uk-button-small" data-resource="${res}" data-action="increase">+</button>
        </div>`;
    }).join('');
    
    return treasuryHtml + commoditiesHtml;
  },

  // MODIFIED: Renders leader cards, now showing their key ability.
  renderLeaders(kingdom) {
    return Object.entries(kingdom.leaders).map(([role, leader]) => {
      let statusBadge = '';
      if (leader.status === "PC") statusBadge = '<span class="uk-badge" style="background-color: #1e87f0; color: white;">PLAYER</span>';
      else if (leader.status === "NPC") statusBadge = '<span class="uk-badge" style="background-color: #32d296; color: white;">NPC</span>';
      else if (leader.status === "Vacant") statusBadge = '<span class="uk-badge uk-background-muted">VACANT</span>';

      if (leader.isInvested && leader.status !== "Vacant") {
          statusBadge += ' <span class="uk-badge" style="background-color: #ff9900; color: white;" uk-tooltip="Grants a status bonus to its key ability.">INVESTED</span>';
      }

      const keyAbility = LEADER_ROLES_MAP[role] || "N/A";

      return `
        <div class="uk-card uk-card-default uk-card-body uk-card-small uk-margin-small-bottom">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand">
              <h5 class="uk-card-title uk-margin-remove-bottom uk-text-capitalize">${role}</h5>
              <p class="uk-text-meta uk-margin-remove-top">${leader.name || "<i>Unassigned</i>"} (${keyAbility})</p>
            </div>
            <div class="uk-width-auto">
              ${statusBadge}
            </div>
          </div>
        </div>`;
    }).join('');
  }
};

const UI = {
   renderKingdomSheet() {
    const container = document.getElementById("kingdom-sheet-content");
    const controlDC = KingdomService.calculateControlDC();
    
    // Get the Unrest Penalty for the header display
    const unrestPenalty = kingdom.unrest >= 15 ? 4 : kingdom.unrest >= 10 ? 3 : kingdom.unrest >= 5 ? 2 : kingdom.unrest >= 1 ? 1 : 0;
    
    let levelUpHtml = '';
    if (kingdom.xp >= CONFIG.XP_CAP && kingdom.level < 20) {
      levelUpHtml = `
        <div class="uk-alert-success" uk-alert>
          <a class="uk-alert-close" uk-close></a>
          <p class="uk-text-center">You have enough XP to advance to Level ${kingdom.level + 1}!
            <button class="uk-button uk-button-primary uk-button-small uk-margin-left" id="kingdom-level-up-btn">Level Up!</button>
          </p>
        </div>`;
    }

    container.innerHTML = `
      ${KingdomRenderer.renderHeader(kingdom, controlDC, unrestPenalty)}
      ${levelUpHtml}
      
      <div class="uk-grid-divider uk-child-width-1-2@m" uk-grid>
        
        <div>
          <div class="uk-card uk-card-default uk-card-body uk-margin-bottom">
            <h4 class="uk-card-title">Ability Scores & Ruin</h4>
            <div class="uk-child-width-1-2@s uk-grid-small" uk-grid>
              ${KingdomRenderer.renderAbilitiesAndRuins(kingdom)}
            </div>
          </div>
          
          <div class="uk-card uk-card-default uk-card-body">
            <h4 class="uk-card-title">Resources & Commodities</h4>
            ${KingdomRenderer.renderResources(kingdom)}
          </div>
        </div>

        <div>
          <div class="uk-card uk-card-default uk-card-body">
            <h4 class="uk-card-title">Leadership</h4>
            ${KingdomRenderer.renderLeaders(kingdom)}
          </div>
        </div>
        
      </div>`;
  },

  renderSkillsAndFeats() {
    const container = document.getElementById("skills-feats-content");
    const skillMods = KingdomService.calculateSkillModifiers();

    const featsHtml = "<ul>" + Object.entries(kingdom.advancement).map(([levelKey, adv]) => {
      if (!adv.feat) return '';
      const level = levelKey.replace('lvl', '');
      return `<li><b>Lvl ${level}:</b> ${adv.feat} ${adv.featOption ? `(${adv.featOption})` : ''}</li>`;
    }).join('') + "</ul>";

    const abilitiesHtml = "<ul>" + Object.entries(kingdom.advancement).map(([levelKey, adv]) => {
      if (!adv.abilityBoosts) return '';
      const level = levelKey.replace('lvl', '');
      return `<li><b>Lvl ${level}:</b> ${adv.abilityBoosts}</li>`;
    }).join('') + "</ul>";

    const skillsHtml = `<table class="uk-table uk-table-small uk-table-divider skills-table">
      <thead><tr><th>Skill</th><th>Ability</th><th>Total</th><th>Prof</th></tr></thead>
      <tbody>${Object.entries(kingdom.skills).map(([skillName, skill]) => `
        <tr>
          <td class="skill-name">${skillName}</td>
          <td>${KINGDOM_SKILLS[skillName].charAt(0).toUpperCase()}</td>
          <td>${skillMods[skillName] >= 0 ? "+" : ""}${skillMods[skillName]}</td>
          <td>${PROFICIENCY_RANKS[skill.prof]}</td>
        </tr>`).join('')}
      </tbody></table>`;

    container.innerHTML = `
      <div class="uk-grid-divider" uk-grid>
        <div class="uk-width-1-2@m">
          <h3 class="uk-card-title">Skills</h3>
          ${skillsHtml}
        </div>
        <div class="uk-width-1-2@m">
          <h3 class="uk-card-title">Feats</h3>
          ${featsHtml}
          <hr>
          <h3 class="uk-card-title">Abilities</h3>
          ${abilitiesHtml}
        </div>
      </div>`;
  },

  renderTurnTracker() {
    const container = document.getElementById("turn-tracker-content");
    const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || KINGDOM_SIZE_TABLE[0];
    const numDice = kingdom.level + 4 + (turnData.turnBonusResourceDice || 0) - (turnData.turnPenaltyResourceDice || 0);
    const consumption = KingdomService.calculateConsumption().food;

    const upkeepHtml = `
      <h4 class="uk-heading-line uk-text-center"><span>Upkeep Phase</span></h4>
      <div class="uk-grid-small" uk-grid>
        <div class="uk-width-expand@s">
          <p class="uk-text-meta uk-margin-remove">Resource Dice: ${numDice}d${sizeData.die}</p>
          <p class="uk-text-meta uk-margin-remove">Resource Points (RP) for this turn: ${turnData.turnResourcePoints || 0}</p>
          <p class="uk-text-meta uk-margin-remove">Kingdom Consumption: ${consumption} Food</p>
        </div>
        <div class="uk-width-auto@s uk-text-right">
          <button class="uk-button uk-button-primary uk-margin-small-bottom" id="upkeep-roll-resources" ${turnData.rolledResources ? 'disabled' : ''}>1. Roll Resources</button>
          <button class="uk-button uk-button-primary uk-margin-small-bottom" id="upkeep-pay-consumption" ${turnData.paidConsumption ? 'disabled' : ''}>2. Pay Consumption</button>
          <button class="uk-button uk-button-primary" id="upkeep-apply-unrest" ${turnData.appliedUnrest ? 'disabled' : ''}>3. Apply Unrest Effects</button>
        </div>
      </div>
    `;

    let activitiesHtml = '';
    for (const category in KINGDOM_ACTIVITIES) {
      activitiesHtml += `<h4 class="uk-heading-line uk-text-center uk-margin-top"><span>${category.charAt(0).toUpperCase() + category.slice(1)} Activities</span></h4>`;
      activitiesHtml += '<div class="uk-grid-small uk-child-width-1-2@s" uk-grid>';
      KINGDOM_ACTIVITIES[category].forEach(activityName => {
        const key = `activity_${activityName.replace(/\s+/g, '_')}`;
        const isChecked = turnData[key] ? 'checked' : '';
        activitiesHtml += `
          <div>
            <label><input class="uk-checkbox" type="checkbox" data-key="${key}" ${isChecked}> ${activityName}</label>
          </div>`;
      });
      activitiesHtml += '</div>';
    }
    
    const eventCheckDC = 16 - (kingdom.eventCheckModifier || 0);
    const eventPhaseHtml = `
      <h4 class="uk-heading-line uk-text-center"><span>Event Phase</span></h4>
      <div class="uk-grid-small" uk-grid>
        <div class="uk-width-expand@s">
          <p class="uk-text-meta uk-margin-remove">Current Event Check DC: ${eventCheckDC}</p>
          <p class="uk-text-meta uk-margin-remove">Current Event: ${turnData.currentEvent || 'None'}</p>
        </div>
        <div class="uk-width-auto@s uk-text-right">
          <button class="uk-button uk-button-primary" id="event-check-event" ${turnData.eventChecked ? 'disabled' : ''}>Check for Event</button>
        </div>
      </div>
    `;

    const endOfTurnHtml = `
      <h4 class="uk-heading-line uk-text-center"><span>End of Turn</span></h4>
      <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-2@s">
          <label class="uk-form-label">XP Gained this Turn</label>
          <input class="uk-input" type="number" data-key="turnXP" value="${turnData.turnXP || 0}" placeholder="XP from events, milestones...">
        </div>
        <div class="uk-width-1-2@s">
          <label class="uk-form-label">Event Name (if not random)</label>
          <input class="uk-input" type="text" data-key="currentEvent" value="${turnData.currentEvent || ''}" placeholder="Story event, etc.">
        </div>
        <div class="uk-width-1-1">
          <label class="uk-form-label">Turn Notes</label>
          <textarea class="uk-textarea" rows="3" data-key="currentNotes" placeholder="Any notes for this turn...">${turnData.currentNotes || ""}</textarea>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="uk-flex uk-flex-between uk-flex-middle">
        <h3 class="uk-card-title">Turn Tracker (Fame: ${turnData.turnFame || kingdom.fame}, Unrest: ${turnData.turnUnrest || kingdom.unrest})</h3>
        <div>
          <button id="save-turn-btn" class="uk-button uk-button-primary">Save Turn</button>
          <button id="clear-turn-btn" class="uk-button uk-button-secondary">Clear Turn</button>
        </div>
      </div>
      <hr>
      ${upkeepHtml}
      <hr>
      ${activitiesHtml}
      <hr>
      ${eventPhaseHtml}
      <hr>
      ${endOfTurnHtml}
    `;
  },

  renderHistory() {
    const container = document.getElementById("history-content");
    if (history.length === 0) {
      container.innerHTML = '<h3 class="uk-card-title">History</h3><p>No turns have been saved yet.</p>';
      return;
    }
    
    const historyRows = history.map((turn, i) => {
      const performedActivities = Object.keys(turn)
        .filter(key => key.startsWith("activity_") && turn[key])
        .map(key => key.substring(9).replace(/_/g, " "))
        .join(", ") || "None";
        
      return `<tr>
          <td>${history.length - i} (Lvl ${turn.kingdomLevel})</td>
          <td>${turn.currentEvent || "N/A"}</td>
          <td>${turn.foodConsumed || 0}</td>
          <td>${performedActivities}</td>
          <td>${turn.currentNotes || "..."}</td>
        </tr>`;
    }).join('');
    
    container.innerHTML = `<h3 class="uk-card-title">History</h3>
      <table class="uk-table uk-table-striped uk-table-hover uk-table-small">
        <thead><tr><th>Turn</th><th>Event</th><th>Food Consumed</th><th>Activities</th><th>Notes</th></tr></thead>
        <tbody>${historyRows}</tbody>
      </table>`;
  },

  renderSettlements() {
    const container = document.getElementById("settlements-content");
    let html = `<div class="uk-flex uk-flex-between uk-flex-middle">
        <h3 class="uk-card-title">Settlements & Urban Grids</h3>
        <button id="add-settlement-btn" class="uk-button uk-button-primary">Add New Settlement</button>
    </div>`;

    if (kingdom.settlements.length === 0) {
        html += "<p>No settlements created yet.</p>";
    } else {
        html += '<ul uk-accordion="multiple: true">';
        kingdom.settlements.forEach((settlement) => {
            const gridLots = settlement.lots.map((lot, index) => {
                let classes = "grid-lot";
                let style = "";
                let content = "";
                if (lot.buildingId) {
                    const structure = AVAILABLE_STRUCTURES.find(s => s.name === lot.structureName);
                    style = `background-color: ${structure ? STRUCTURE_COLORS[structure.category] : "#ccc"}; color: #333;`;
                    if (lot.isOrigin) {
                        content = lot.structureName;
                        classes += " can-build";
                    } else {
                        classes += " occupied-child";
                    }
                } else {
                    classes += " can-build";
                }
                return `<button class="${classes}" style="${style}" data-settlement-id="${settlement.id}" data-lot-index="${index}">${content}</button>`;
            }).join("");

            html += `<li class="uk-open">
                <a class="uk-accordion-title" href="#">${settlement.name}
                    <button class="uk-button uk-button-danger uk-button-small uk-float-right" data-delete-settlement-id="${settlement.id}">Delete</button>
                </a>
                <div class="uk-accordion-content">
                    <div class="urban-grid cols-${settlement.gridSize}">${gridLots}</div>
                </div>
            </li>`;
        });
        html += "</ul>";
    }
    container.innerHTML = html;
  },

  renderArmies() {
    const container = document.getElementById("armies-content");
    let html = `<div class="uk-flex uk-flex-between uk-flex-middle">
        <h3 class="uk-card-title">Armies</h3>
        <button id="add-army-btn" class="uk-button uk-button-primary">Add New Army</button>
    </div>`;

    if (!kingdom.armies || kingdom.armies.length === 0) {
        html += "<p>No armies have been recruited yet.</p>";
    } else {
        html += '<div uk-grid class="uk-child-width-1-2@m">';
        kingdom.armies.forEach(army => {
            html += `<div>
                <div class="uk-card uk-card-default uk-card-body army-card">
                    <div class="uk-card-badge uk-label">${army.location || "Undeployed"}</div>
                    <h4 class="uk-card-title">${army.name} (Lvl ${army.level})</h4>
                    <dl class="uk-description-list uk-description-list-divider">
                        <dt>HP</dt><dd>${army.hp}</dd><dt>AC</dt><dd>${army.ac}</dd>
                        <dt>Attack</dt><dd>+${army.attack}</dd><dt>Damage</dt><dd>${army.damage}</dd>
                        <dt>Consumption</dt><dd>${army.consumption}</dd>
                    </dl>
                    <p><strong>Notes:</strong> ${army.notes || "None"}</p>
                    <button class="uk-button uk-button-secondary uk-button-small" data-edit-army-id="${army.id}">Edit</button>
                    <button class="uk-button uk-button-danger uk-button-small" data-delete-army-id="${army.id}">Delete</button>
                </div>
            </div>`;
        });
        html += "</div>";
    }
    container.innerHTML = html;
  },

   renderKingdomManagement() {
    const container = document.getElementById("kingdom-management-content");
    const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
    const kingdoms = fullState.kingdoms;
    const activeId = fullState.activeKingdomId;

    // Build the list of kingdoms for the left panel
    let kingdomsHtml = '<ul class="uk-list uk-list-divider">';
    if (Object.keys(kingdoms).length === 0) {
        kingdomsHtml += '<li>No kingdoms found. Click "Create New Kingdom" to begin.</li>';
    } else {
        for (const id in kingdoms) {
            const k = kingdoms[id].kingdom;
            const isActive = activeId === id;
            kingdomsHtml += `
                <li>
                    <div class="uk-grid-small uk-flex-middle" uk-grid>
                        <div class="uk-width-expand">
                            <a href="#" class="uk-link-reset" data-load-id="${id}">
                                <span class="uk-text-bold">${k.name}</span>
                                <span class="uk-text-meta uk-display-block">Level ${k.level}</span>
                            </a>
                        </div>
                        <div class="uk-width-auto">
                            ${isActive ? '<span class="uk-label uk-label-success">ACTIVE</span>' : ''}
                            <a href="#" class="uk-icon-link" uk-icon="file-edit" data-rename-id="${id}" uk-tooltip="Rename"></a>
                            <a href="#" class="uk-icon-link uk-text-danger" uk-icon="trash" data-delete-id="${id}" ${isActive ? 'disabled' : ''} uk-tooltip="Delete"></a>
                        </div>
                    </div>
                </li>`;
        }
    }
    kingdomsHtml += '</ul>';

    // Determine the content for the right-side Workspace panel
    let workspaceHtml = '';
    if (isCreationMode) {
        workspaceHtml = CreationService.renderCreationForm();
    } else {
        let levelUpButtonHtml = '';
        if (kingdom.xp >= CONFIG.XP_CAP && kingdom.level < 20) {
            levelUpButtonHtml = `
                <div class="uk-alert-primary" uk-alert>
                  <p class="uk-text-center">You have enough XP to advance to Level ${kingdom.level + 1}!
                    <button class="uk-button uk-button-primary uk-button-small uk-margin-left" id="kingdom-level-up-btn">Level Up!</button>
                  </p>
                </div>`;
        }

        workspaceHtml = `
            <div class="uk-card uk-card-default uk-card-body">
                <h3 class="uk-card-title">Kingdom Advancement</h3>
                ${levelUpButtonHtml}
                <p>This is your kingdom's advancement and level-up center. When your kingdom is ready to advance, a "Level Up!" button will appear here.</p>
                <p>You can view your completed advancement choices on the "Skills & Feats" tab.</p>
            </div>`;
    }

    // This defines the full two-panel layout for the tab
    container.innerHTML = `
        <div class="uk-grid-divider" uk-grid>
            <div class="uk-width-1-3@m">
                <div class="uk-card uk-card-default uk-card-body uk-card-small">
                    <h3 class="uk-card-title">Kingdoms</h3>
                    ${kingdomsHtml}
                    <hr>
                    <div class="uk-grid-small uk-child-width-1-1" uk-grid>
                        <div><button class="uk-button uk-button-primary uk-width-1-1" id="create-new-kingdom-btn">Create New Kingdom</button></div>
                        <div><button class="uk-button uk-button-secondary uk-width-1-1" id="import-btn">Import</button></div>
                        <div><button class="uk-button uk-button-secondary uk-width-1-1" id="export-btn">Export Active Kingdom</button></div>
                    </div>
                </div>
            </div>
            <div class="uk-width-2-3@m" id="kingdom-workspace">
                ${workspaceHtml}
            </div>
        </div>
    `;

    if(isCreationMode) {
        CreationService.calculateAndRenderScores();
    }
  },

  renderCreation() {
    const container = document.getElementById("creation-content");
    const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
    const kingdomCount = Object.keys(fullState.kingdoms).length;
    const isNewGame = kingdomCount <= 1 && kingdom.name === "Silverwood";

    // ===================================================================
    // MODIFIED CONDITION: Show the form if it's a new game OR if creation mode is active.
    // ===================================================================
    if (isCreationMode || isNewGame) {
        const createOptions = (sourceObject, selectedKey) => {
            return Object.entries(sourceObject).map(([key, value]) =>
                `<option value="${key}" ${key === selectedKey ? "selected" : ""}>${value.name}</option>`
            ).join('');
        };
        // The form's HTML structure itself doesn't need to change.
        container.innerHTML = `
            <h3 class="uk-card-title">Kingdom Creation</h3>
            <p>Define your new kingdom using the steps from the rulebook. All choices here will set the initial state of your kingdom. Press "Create and Save" at the bottom when finished.</p>
            <form class="uk-form-stacked" id="creation-form">
                <div class="uk-margin"><label class="uk-form-label">Kingdom Name</label><input class="uk-input" id="kingdom-name-input" type="text" data-key="name" value="${kingdom.name === "Silverwood" ? "" : kingdom.name}"></div>
                <div class="uk-margin"><label class="uk-form-label">Capital Name</label><input class="uk-input" id="kingdom-capital-input" type="text" data-key="capital" value="${kingdom.capital === "Stag's Rest" ? "" : kingdom.capital}"></div><hr>
                <div class="uk-margin"><label class="uk-form-label">1. Select Charter</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="charter">${createOptions(KINGDOM_CHARTERS, kingdom.charter)}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-charter-boost-select" data-creation-key="charterBoost"></select></div></div></div>
                <div class="uk-margin"><label class="uk-form-label">2. Select Heartland</label><select class="uk-select" data-creation-key="heartland">${createOptions(KINGDOM_HEARTLANDS, kingdom.heartland)}</select></div>
                <div class="uk-margin"><label class="uk-form-label">3. Select Government</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="government">${createOptions(KINGDOM_GOVERNMENTS, kingdom.government)}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-government-boost-select" data-creation-key="governmentBoost"></select></div></div></div>
                <div class="uk-margin"><label class="uk-form-label">4. Final Free Ability Boosts</label><div class="uk-grid-small" uk-grid><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-1" data-creation-key="freeBoost1"></select></div><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-2" data-creation-key="freeBoost2"></select></div></div></div>
                <div class="uk-margin"><label class="uk-form-label">5. Initial Skill Investments (from invested leaders)</label><p class="uk-text-meta">Select four different skills to become Trained in. These cannot be the same skills provided by your Government choice.</p><div class="uk-grid-small" uk-grid><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-1" data-creation-key="skillInvest1"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-2" data-creation-key="skillInvest2"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-3" data-creation-key="skillInvest3"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-4" data-creation-key="skillInvest4"></select></div></div></div><hr>
                <h4 class="uk-heading-line"><span>Resulting Base Scores</span></h4>
                <div id="ability-score-results" class="uk-child-width-1-4" uk-grid>
                    <div><dl class="uk-description-list"><dt>Culture</dt><dd id="result-culture">10</dd></dl></div>
                    <div><dl class="uk-description-list"><dt>Economy</dt><dd id="result-economy">10</dd></dl></div>
                    <div><dl class="uk-description-list"><dt>Loyalty</dt><dd id="result-loyalty">10</dd></dl></div>
                    <div><dl class="uk-description-list"><dt>Stability</dt><dd id="result-stability">10</dd></dl></div>
                </div>
                <button type="button" id="save-creation-btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-top">Create and Save Kingdom</button>
            </form>
        `;
        // We also need to immediately run the calculation functions to populate the dropdowns
        CreationService.calculateAndRenderScores();
    } else {
        // This is the default view for the tab when not in creation mode.
        container.innerHTML = `
            <h3 class="uk-card-title">Kingdom Advancement</h3>
            <p>This tab is used for creating new kingdoms and for managing kingdom advancement choices (like selecting feats and skill increases) as you level up.</p>
            <p>To create a new kingdom, please go to the <strong>Save Management</strong> tab.</p>
        `;
    }
  },
  renderSaveManagement() {
    const container = document.getElementById("save-management-content");
    container.innerHTML = `
        <h3 class="uk-card-title">Kingdom Management</h3>
        <p>Create a new kingdom, or load, rename, and delete existing ones.</p>
        <div class="uk-button-group">
            <button id="manage-kingdoms-btn" class="uk-button uk-button-primary">Manage Kingdoms</button>
        </div>
        <hr>
        <h3 class="uk-card-title">Save & Export</h3>
        <p>Use export to create a backup file of your currently active kingdom and import to load from one.</p>
        <div class="uk-button-group">
            <button id="import-btn" class="uk-button uk-button-primary">Import Kingdom</button>
            <button id="export-btn" class="uk-button uk-button-secondary">Export Kingdom</button>
        </div>
        <hr>
        <h3 class="uk-card-title">Reset All Data</h3>
        <p>This will permanently erase ALL kingdoms and start fresh.</p>
        <button id="reset-kingdom-btn" class="uk-button uk-button-danger">Reset All Data</button>
    `;
  },

  renderAll() {
    this.renderKingdomSheet();
    this.renderSkillsAndFeats();
    this.renderHistory();
    this.renderTurnTracker();
    this.renderSettlements();
    this.renderArmies();
this.renderKingdomManagement();
  }
};

// ==========================================
// MODAL & UI HELPERS
// ==========================================

const ModalService = {
    showConfirmation(message, onConfirm) {
    // Add cleanup before showing
    ModalCleanup.ensureCleanState();
    
    UIkit.modal.confirm(message).then(() => {
      if (onConfirm) onConfirm();
    }, () => {
      // User cancelled - no action needed
    }).finally(() => {
      // Ensure cleanup after modal closes
      setTimeout(() => {
        ModalCleanup.ensureCleanState();
      }, 300); // Small delay to allow animation to complete
    });
  },

  showForm(title, formHtml, onSave) {
    // Add cleanup before showing
    ModalCleanup.ensureCleanState();
    
    const modalContent = `
        <div class="uk-modal-header"><h2 class="uk-modal-title">${title}</h2></div>
        <div class="uk-modal-body">${formHtml}</div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close">Cancel</button>
            <button class="uk-button uk-button-primary" id="modal-save-btn">Save</button>
        </div>`;

    const modal = UIkit.modal.dialog(modalContent);
    const saveButton = modal.$el.querySelector("#modal-save-btn");
    
    saveButton.addEventListener("click", () => {
        if (onSave(modal.$el)) {
            modal.hide();
            // Add cleanup after hide
            setTimeout(() => {
                ModalCleanup.ensureCleanState();
            }, 300);
        }
    });
    
    // Also clean up if modal is closed by other means
    modal.$el.addEventListener('hide', () => {
        setTimeout(() => {
            ModalCleanup.ensureCleanState();
        }, 300);
    });
  },

  showLevelUp(newLevel) {
        ModalCleanup.ensureCleanState();

    const advancement = kingdom.advancement[`lvl${newLevel}`];
    if (!advancement) {
        UIkit.modal.alert("No advancement data found for this level.");
        return;
    }

    let benefitsHtml = '<ul>';
    if (advancement.hasOwnProperty('feat')) benefitsHtml += '<li>A new Kingdom Feat</li>';
    if (advancement.hasOwnProperty('skillIncrease')) benefitsHtml += '<li>A Kingdom Skill Increase</li>';
    if (advancement.hasOwnProperty('abilityBoosts')) benefitsHtml += '<li>Kingdom Ability Boosts</li>';
    if (advancement.hasOwnProperty('ruinResistance')) benefitsHtml += '<li>Increased Ruin Resistance</li>';
    benefitsHtml += '</ul>';

    const skillIncreaseDone = advancement.skillIncrease !== '';
    const featDone = advancement.feat !== '';

    let choicesHtml = '';
    if (advancement.hasOwnProperty('skillIncrease')) {
        choicesHtml += `<button class="uk-button uk-button-secondary uk-margin-small-right" id="level-up-skill-btn" ${skillIncreaseDone ? 'disabled' : ''}>Choose Skill Increase</button>`;
    }
    if (advancement.hasOwnProperty('feat')) {
        choicesHtml += `<button class="uk-button uk-button-secondary" id="level-up-feat-btn" ${featDone ? 'disabled' : ''}>Choose Feat</button>`;
    }

    const modalContent = `
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Your kingdom has reached Level ${newLevel}!</h2>
        </div>
        <div class="uk-modal-body">
            <p>You gain the following benefits:</p>
            ${benefitsHtml}
            <p>Please make your selections below. Choices are permanent.</p>
            ${choicesHtml}
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-primary" id="level-up-finish-btn">Finish Level Up</button>
        </div>`;

    const modal = UIkit.modal.dialog(modalContent);

modal.$el.addEventListener('hide', () => {
        setTimeout(() => {
            ModalCleanup.ensureCleanState();
        }, 300);
    });

    const featButton = modal.$el.querySelector('#level-up-feat-btn');
    if (featButton) {
        featButton.addEventListener('click', () => {
            this.showFeatSelection(newLevel);
            modal.hide();
        });
    }

    const skillButton = modal.$el.querySelector('#level-up-skill-btn');
    if (skillButton) {
        skillButton.addEventListener('click', () => {
            this.showSkillIncrease(newLevel);
            modal.hide();
        });
    }

    modal.$el.querySelector('#level-up-finish-btn').addEventListener('click', () => {
        kingdom.level = newLevel;
        kingdom.xp -= CONFIG.XP_CAP;
        SaveService.save();
        UI.renderAll();
        modal.hide();
        ErrorHandler.showSuccess(`Kingdom advancement to Level ${newLevel} complete!`);
    });
  },

  showSkillIncrease(level) {
    let skillOptionsHtml = '<ul class="uk-list uk-list-divider">';

    for (const skillName in kingdom.skills) {
        const currentRank = kingdom.skills[skillName].prof;
        if (currentRank < PROFICIENCY_RANKS.length - 1) {
            const nextRankName = PROFICIENCY_RANKS[currentRank + 1];
            skillOptionsHtml += `
                <li>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand">${skillName} (${PROFICIENCY_RANKS[currentRank]})</div>
                        <div class="uk-width-auto">
                            <button class="uk-button uk-button-primary uk-button-small" data-skill-name="${skillName}">Increase to ${nextRankName}</button>
                        </div>
                    </div>
                </li>`;
        }
    }
    skillOptionsHtml += '</ul>';

    const modal = UIkit.modal.dialog(`
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Choose Skill Increase for Level ${level}</h2>
        </div>
        <div class="uk-modal-body">${skillOptionsHtml}</div>
    `);

    modal.$el.addEventListener('click', (e) => {
        if (e.target.matches('button[data-skill-name]')) {
            const skillName = e.target.dataset.skillName;
            kingdom.advancement[`lvl${level}`].skillIncrease = skillName;
            SaveService.save();
            modal.hide();
            this.showLevelUp(level);
        }
    });
  },

  showFeatSelection(level) {
    let featOptionsHtml = '<ul class="uk-list uk-list-divider">';
    
    const eligibleFeats = KINGDOM_FEATS.filter(feat => 
        feat.level <= level && KingdomService.checkFeatPrerequisites(feat)
    );

    if (eligibleFeats.length === 0) {
        featOptionsHtml += '<li>Your kingdom does not currently meet the prerequisites for any available feats.</li>';
    } else {
        eligibleFeats.forEach(feat => {
            featOptionsHtml += `
                <li>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand">
                            <a class="uk-text-bold" uk-tooltip="title: ${feat.description}; pos: top-left">${feat.name}</a>
                            <p class="uk-text-meta uk-margin-remove">Lvl ${feat.level} ${feat.prereq ? `(Prereq: ${feat.prereq.skill || feat.prereq.ability || 'Multiple Skills Trained'})` : ''}</p>
                        </div>
                        <div class="uk-width-auto">
                            <button class="uk-button uk-button-primary uk-button-small" data-feat-name="${feat.name}">Select</button>
                        </div>
                    </div>
                </li>`;
        });
    }
    featOptionsHtml += '</ul>';

    const modal = UIkit.modal.dialog(`
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Choose Feat for Level ${level}</h2>
        </div>
        <div class="uk-modal-body">${featOptionsHtml}</div>
    `);

    modal.$el.addEventListener('click', (e) => {
        if (e.target.matches('button[data-feat-name]')) {
            const featName = e.target.dataset.featName;
            kingdom.advancement[`lvl${level}`].feat = featName;
            SaveService.save();
            modal.hide();
            this.showLevelUp(level);
        }
    });
  },

  showKingdomManagement() {
    const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
    const kingdoms = fullState.kingdoms;
    const activeId = fullState.activeKingdomId;

    let kingdomsHtml = '<ul class="uk-list uk-list-divider">';
    if (Object.keys(kingdoms).length === 0) {
        kingdomsHtml += '<li>No kingdoms found. Click "Create New" to begin.</li>';
    } else {
        for (const id in kingdoms) {
            const k = kingdoms[id].kingdom;
            const isActive = activeId === id;
            kingdomsHtml += `
                <li>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand">
                            <span class="uk-text-bold">${k.name}</span>
                            <span class="uk-text-meta uk-display-block">Level ${k.level}</span>
                        </div>
                        <div class="uk-width-auto">
                            ${isActive ? '<span class="uk-label uk-label-success">ACTIVE</span>' : `<button class="uk-button uk-button-primary uk-button-small" data-load-id="${id}">Load</button>`}
                            <button class="uk-button uk-button-default uk-button-small" data-rename-id="${id}">Rename</button>
                            <button class="uk-button uk-button-danger uk-button-small" data-delete-id="${id}" ${isActive ? 'disabled' : ''}>Delete</button>
                        </div>
                    </div>
                </li>`;
        }
    }
    kingdomsHtml += '</ul>';

    const modalContent = `
        <div class="uk-modal-header"><h2 class="uk-modal-title">Manage Kingdoms</h2></div>
        <div class="uk-modal-body">${kingdomsHtml}</div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close">Close</button>
            <button class="uk-button uk-button-primary" id="create-new-kingdom-btn">Create New Kingdom</button>
        </div>`;
    
    const modal = UIkit.modal.dialog(modalContent);

    modal.$el.addEventListener('click', (e) => {
        const target = e.target;
        
        // ===================================================================
        // MODIFIED LOGIC for the "Create New Kingdom" button
        // ===================================================================
        if (target.id === 'create-new-kingdom-btn') {
            isCreationMode = true; // Set the global flag
            modal.hide(); // Close the current modal
            UIkit.tab("#main-tabs").show(6); // Switch to the "Creation & Advancement" tab
            UI.renderCreation(); // Re-render the tab to ensure the form is shown
            return; 
        } 
        // ===================================================================
        
        const loadId = target.dataset.loadId;
        const renameId = target.dataset.renameId;
        const deleteId = target.dataset.deleteId;

        if (loadId) {
            fullState.activeKingdomId = loadId;
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
            window.location.reload();
        } 
        else if (renameId) {
            UIkit.modal.prompt('New Kingdom Name:', kingdoms[renameId].kingdom.name).then(newName => {
                if (newName && newName.trim()) {
                    kingdoms[renameId].kingdom.name = newName.trim();
                    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                    modal.hide();
                    this.showKingdomManagement(); // Re-open the modal to show the change
                }
            });
        } 
        else if (deleteId) {
            UIkit.modal.confirm(`Are you sure you want to permanently delete "${kingdoms[deleteId].kingdom.name}"?`).then(() => {
                delete fullState.kingdoms[deleteId];
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                modal.hide();
                this.showKingdomManagement(); // Re-open the modal to show the change
            });
        }
    });
  },  
};

// ==========================================
// SETTLEMENT & ARMY MANAGEMENT
// ==========================================

const SettlementService = {
  addSettlement() {
    UIkit.modal.prompt("New Settlement Name:", "New Settlement").then(name => {
      if (!name) return;
      validateAndExecute({ value: name }, (val) => Validators.isNotEmpty(val) && Validators.isLength(val, 50), (validName) => {
        const newSettlement = {
          id: Date.now(), name: validName, gridSize: 6,
          lots: Array(36).fill(null).map(() => ({ buildingId: null, isOrigin: false, structureName: null })),
          infrastructure: {
            sewerSystem: false,
            pavedStreets: false,
            magicalStreetlamps: false
          }
        };
        kingdom.settlements.push(newSettlement);
        SaveService.save();
        UI.renderSettlements();
      });
    });
  },

  deleteSettlement(settlementId) {
    ModalService.showConfirmation("Are you sure you want to delete this settlement?", () => {
      const settlementName = kingdom.settlements.find(s => s.id == settlementId)?.name || "Settlement";
      kingdom.settlements = kingdom.settlements.filter(s => s.id != settlementId);
      SaveService.save();
      UI.renderSettlements();
      UI.renderKingdomSheet();
      ErrorHandler.showError("Settlement deleted.");
    });
  },

  canPlaceStructure(settlement, startX, startY, width, height) {
    if (startX + width > settlement.gridSize || startY + height > settlement.gridSize) return false;
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (settlement.lots[y * settlement.gridSize + x].buildingId) return false;
      }
    }
    return true;
  },

   placeStructure(settlementId, lotIndex, structureName) {
    const settlement = kingdom.settlements.find(s => s.id == settlementId);
    const structure = AVAILABLE_STRUCTURES.find(s => s.name === structureName);
    if (!structure || !settlement) return;

    // First, handle the special case for "Clear Lot" (Demolish)
    if (structure.name === "Clear Lot") {
        const oldBuildingId = settlement.lots[lotIndex].buildingId;
        if (oldBuildingId) {
            settlement.lots.forEach(lot => {
                if (lot.buildingId === oldBuildingId) {
                    Object.assign(lot, { buildingId: null, isOrigin: false, structureName: null });
                }
            });
            ErrorHandler.showSuccess("Lot cleared.");
            SaveService.save();
            UI.renderAll();
        }
        return;
    }
    
    // ===================================================================
    // NEW LOGIC: Check for all required resources (RP and commodities)
    // ===================================================================
    const costs = structure.cost;
    const canAfford = Object.keys(costs).every(resource => {
        const cost = costs[resource];
        const resourceKey = resource === 'rp' ? 'treasury' : resource;
        return kingdom[resourceKey] >= cost;
    });

    if (!canAfford) {
        ErrorHandler.showError("You do not have enough resources to build this structure.");
        return;
    }
    
    // If affordable, subtract all costs
    Object.keys(costs).forEach(resource => {
        const cost = costs[resource];
        const resourceKey = resource === 'rp' ? 'treasury' : resource;
        kingdom[resourceKey] -= cost;
    });
    // ===================================================================

    // The rest of the logic for placing the building on the grid remains the same
    const [width, height] = structure.lots;
    const startX = lotIndex % settlement.gridSize;
    const startY = Math.floor(lotIndex / settlement.gridSize);
    
    if (!this.canPlaceStructure(settlement, startX, startY, width, height)) {
        ErrorHandler.showError("Not enough space to build here.");
        // We should refund the cost if the placement check fails for some reason
        Object.keys(costs).forEach(resource => {
            const cost = costs[resource];
            const resourceKey = resource === 'rp' ? 'treasury' : resource;
            kingdom[resourceKey] += cost;
        });
        return;
    }

    const buildingId = Date.now();
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        settlement.lots[y * settlement.gridSize + x] = { buildingId, isOrigin: x === startX && y === startY, structureName };
      }
    }
    
    // Handle Ruin increase on construction
    if (structure.ruin) {
        // A simple implementation for "Any". You might want a modal to ask the user.
        const ruinType = structure.ruin.type === 'Any' ? 'corruption' : structure.ruin.type.toLowerCase();
        KingdomService.updateRuin(ruinType, structure.ruin.value);
        ErrorHandler.showSuccess(`${structure.name} built! ${structure.ruin.value} ${ruinType} Ruin added.`);
    } else {
        ErrorHandler.showSuccess(`${structure.name} built successfully!`);
    }

    SaveService.save();
    UI.renderAll();
  },

  showEditLot(settlementId, lotIndex) {
    const settlement = kingdom.settlements.find(s => s.id == settlementId);
    if (!settlement) return;
    const lot = settlement.lots[lotIndex];

    if (lot.buildingId && !lot.isOrigin) {
      UIkit.notification({ message: "Click the top-left corner of a building to modify it.", status: "warning" });
      return;
    }

    ModalCleanup.ensureCleanState();

    const startX = lotIndex % settlement.gridSize;
    const startY = Math.floor(lotIndex / settlement.gridSize);

    let html = '<div class="uk-modal-body uk-height-medium uk-overflow-auto"><h4>Select Structure</h4><ul class="uk-list uk-list-striped">';
    
    // We add a special case for demolishing the current structure
    if (lot.buildingId) {
        html += `<li><a href="#" class="select-structure" data-s-name="Demolish Lot">Demolish Lot</a></li>`;
    }

    AVAILABLE_STRUCTURES.forEach(struct => {
      // ===================================================================
      // NEW: Add a check to skip Infrastructure buildings in this UI.
      // We also add `Clear Lot` as a special case, handled above.
      // ===================================================================
      if (struct.traits.includes('Infrastructure') || struct.name === 'Demolish Lot') {
          return; 
      }
      
      const [width, height] = struct.lots;
      const canBuild = this.canPlaceStructure(settlement, startX, startY, width, height);

      // Only show buildable options
      if (canBuild) {
        html += `<li><a href="#" class="select-structure" data-s-name="${struct.name}">${struct.name} (${struct.level})</a></li>`;
      }
    });
    html += "</ul></div>";

    const modal = UIkit.modal.dialog(html);
    
    modal.$el.addEventListener('hide', () => {
        setTimeout(() => {
            ModalCleanup.ensureCleanState();
        }, 300);
    });
    
    modal.$el.addEventListener("click", (e) => {
      if (e.target.matches(".select-structure")) {
        e.preventDefault();
        // The placeStructure function already handles demolish logic
        this.placeStructure(settlementId, lotIndex, e.target.dataset.sName);
        modal.hide();
      }
    });
  },
};

const ArmyService = {
  showArmyModal(armyId = null) {
    const isEditing = armyId !== null;
    const army = isEditing ? kingdom.armies.find(a => a.id === armyId) : {
        id: Date.now(), name: "", level: 1, hp: 10, ac: 16, attack: 5,
        damage: "1d6", consumption: 1, location: "", notes: ""
    };
    
    const formHtml = `
        <form class="uk-form-stacked" uk-grid>
            <div class="uk-width-1-2@s"><label class="uk-form-label">Name</label><input class="uk-input" id="army-name" type="text" value="${army.name}"></div>
            <div class="uk-width-1-2@s"><label class="uk-form-label">Location</label><input class="uk-input" id="army-location" type="text" value="${army.location}"></div>
            <div class="uk-width-1-4@s"><label class="uk-form-label">Level</label><input class="uk-input" id="army-level" type="number" value="${army.level}"></div>
            <div class="uk-width-1-4@s"><label class="uk-form-label">HP</label><input class="uk-input" id="army-hp" type="number" value="${army.hp}"></div>
            <div class="uk-width-1-4@s"><label class="uk-form-label">AC</label><input class="uk-input" id="army-ac" type="number" value="${army.ac}"></div>
            <div class="uk-width-1-4@s"><label class="uk-form-label">Attack Bonus</label><input class="uk-input" id="army-attack" type="number" value="${army.attack}"></div>
            <div class="uk-width-1-2@s"><label class="uk-form-label">Damage</label><input class="uk-input" id="army-damage" type="text" value="${army.damage}"></div>
            <div class="uk-width-1-2@s"><label class="uk-form-label">Consumption</label><input class="uk-input" id="army-consumption" type="number" value="${army.consumption}"></div>
            <div class="uk-width-1-1"><label class="uk-form-label">Notes / Gear</label><textarea class="uk-textarea" id="army-notes" rows="3">${army.notes}</textarea></div>
        </form>`;
        
    ModalService.showForm(isEditing ? "Edit Army" : "Add New Army", formHtml, (modalEl) => {
      const nameInput = modalEl.querySelector("#army-name");
      const levelInput = modalEl.querySelector("#army-level");
      let isValid = true;
      
      try {
          Validators.isNotEmpty(nameInput.value);
          Validators.validateLevel(parseInt(levelInput.value));
      } catch (error) {
          ErrorHandler.showError(error.message);
          isValid = false;
      }
      
      if (isValid) {
          const updatedArmy = {
              id: army.id,
              name: nameInput.value,
              location: modalEl.querySelector("#army-location").value,
              level: parseInt(levelInput.value) || 1,
              hp: parseInt(modalEl.querySelector("#army-hp").value) || 0,
              ac: parseInt(modalEl.querySelector("#army-ac").value) || 10,
              attack: parseInt(modalEl.querySelector("#army-attack").value) || 0,
              damage: modalEl.querySelector("#army-damage").value,
              consumption: parseInt(modalEl.querySelector("#army-consumption").value) || 0,
              notes: modalEl.querySelector("#army-notes").value,
          };
          if (isEditing) {
              const index = kingdom.armies.findIndex(a => a.id === armyId);
              kingdom.armies[index] = updatedArmy;
          } else {
              kingdom.armies.push(updatedArmy);
          }
          SaveService.save();
          UI.renderArmies();
          return true;
      }
      return false;
    });
  },

  deleteArmy(armyId) {
    ModalService.showConfirmation("Are you sure you want to disband this army?", () => {
        const armyName = kingdom.armies.find(a => a.id === armyId)?.name || "Army";
        kingdom.armies = kingdom.armies.filter(a => a.id !== armyId);
        SaveService.save();
        UI.renderArmies();
        ErrorHandler.showError(`${armyName} disbanded.`);
    });
  }
};

// ==========================================
// KINGDOM CREATION LOGIC
// ==========================================

const CreationService = {
  calculateAndRenderScores() {
    const form = document.getElementById("creation-form");
    if (!form) return;

    const getVal = (sel) => form.querySelector(sel)?.value;
    const selections = {
      charter: getVal('[data-creation-key="charter"]'),
      charterBoost: getVal('[data-creation-key="charterBoost"]'),
      heartland: getVal('[data-creation-key="heartland"]'),
      government: getVal('[data-creation-key="government"]'),
      governmentBoost: getVal('[data-creation-key="governmentBoost"]'),
      freeBoost1: getVal('[data-creation-key="freeBoost1"]'),
      freeBoost2: getVal('[data-creation-key="freeBoost2"]'),
    };

    const scores = { culture: 10, economy: 10, loyalty: 10, stability: 10 };
    const boosts = [];
    const flaws = [];

    const charter = KINGDOM_CHARTERS[selections.charter];
    if (charter) {
      if (charter.flaw) flaws.push(charter.flaw);
      charter.boosts.forEach(b => b === "free" ? boosts.push(selections.charterBoost) : boosts.push(b));
    }
    
    const heartland = KINGDOM_HEARTLANDS[selections.heartland];
    if (heartland) boosts.push(heartland.boost);
    
    const gov = KINGDOM_GOVERNMENTS[selections.government];
    if (gov) {
      gov.boosts.forEach(b => b === "free" ? boosts.push(selections.governmentBoost) : boosts.push(b));
    }
    
    boosts.push(selections.freeBoost1, selections.freeBoost2);
    
    boosts.filter(b => b).forEach(b => scores[b] = (scores[b] || 10) + 2);
    flaws.forEach(f => scores[f] = (scores[f] || 10) - 2);

    Object.entries(scores).forEach(([stat, score]) => {
        document.getElementById(`result-${stat}`).textContent = score;
    });

    this.updateFreeBoostDropdowns(selections);
    this.updateSkillInvestmentDropdowns();
  },

  updateFreeBoostDropdowns(selections) {
    const abilityOptions = ["culture", "economy", "loyalty", "stability"];
    const createAbilityBoostOptions = (selectedValue, disabledOptions = []) => {
      let options = '<option value="">-- Select --</option>';
      abilityOptions.forEach(opt => {
        if (!disabledOptions.includes(opt)) {
          options += `<option value="${opt}" ${opt === selectedValue ? "selected" : ""}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`;
        }
      });
      return options;
    };

    const charter = KINGDOM_CHARTERS[selections.charter];
    const charterBoostSelect = document.getElementById("kingdom-charter-boost-select");
    if (charter?.boosts.includes("free")) {
      charterBoostSelect.innerHTML = createAbilityBoostOptions(selections.charterBoost, [charter.flaw, ...charter.boosts.filter(b => b !== "free")]);
      charterBoostSelect.disabled = false;
    } else {
      charterBoostSelect.innerHTML = "";
      charterBoostSelect.disabled = true;
    }
    
    const gov = KINGDOM_GOVERNMENTS[selections.government];
    const govBoostSelect = document.getElementById("kingdom-government-boost-select");
    if (gov?.boosts.includes("free")) {
      govBoostSelect.innerHTML = createAbilityBoostOptions(selections.governmentBoost, gov.boosts.filter(b => b !== "free"));
      govBoostSelect.disabled = false;
    } else {
      govBoostSelect.innerHTML = "";
      govBoostSelect.disabled = true;
    }
    
    document.getElementById("kingdom-free-boost-1").innerHTML = createAbilityBoostOptions(selections.freeBoost1, [selections.freeBoost2]);
    document.getElementById("kingdom-free-boost-2").innerHTML = createAbilityBoostOptions(selections.freeBoost2, [selections.freeBoost1]);
  },

  updateSkillInvestmentDropdowns() {
    const govSkills = KINGDOM_GOVERNMENTS[document.querySelector('[data-creation-key="government"]').value]?.skills || [];
    const selections = Array.from({ length: 4 }, (_, i) => document.getElementById(`skill-invest-${i + 1}`).value);

    for (let i = 0; i < 4; i++) {
        const currentSelect = document.getElementById(`skill-invest-${i + 1}`);
        const currentValue = selections[i];
        const disabledOptions = [...govSkills, ...selections.filter((s, idx) => i !== idx && s)];

        let optionsHTML = '<option value="">-- Select Skill --</option>';
        Object.keys(KINGDOM_SKILLS).forEach(skillName => {
            if (skillName === currentValue) {
                optionsHTML += `<option value="${skillName}" selected>${skillName}</option>`;
            } else if (!disabledOptions.includes(skillName)) {
                optionsHTML += `<option value="${skillName}">${skillName}</option>`;
            }
        });
        currentSelect.innerHTML = optionsHTML;
    }
  },

  renderCreationForm() {
    const createOptions = (sourceObject, selectedKey) => {
        return Object.entries(sourceObject).map(([key, value]) =>
            `<option value="${key}" ${key === selectedKey ? "selected" : ""}>${value.name}</option>`
        ).join('');
    };

    // This HTML is moved from the old UI.renderCreation function
    return `
        <h3 class="uk-card-title">New Kingdom Creation</h3>
        <p>Define your new kingdom using the steps from the rulebook. Press "Create and Save" at the bottom when finished.</p>
        <form class="uk-form-stacked" id="creation-form">
            <div class="uk-margin"><label class="uk-form-label">Kingdom Name</label><input class="uk-input" id="kingdom-name-input" type="text" placeholder="e.g., Tuskwater"></div>
            <div class="uk-margin"><label class="uk-form-label">Capital Name</label><input class="uk-input" id="kingdom-capital-input" type="text" placeholder="e.g., Riverbend"></div><hr>
            <div class="uk-margin"><label class="uk-form-label">1. Select Charter</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="charter">${createOptions(KINGDOM_CHARTERS, 'conquest')}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-charter-boost-select" data-creation-key="charterBoost"></select></div></div></div>
            <div class="uk-margin"><label class="uk-form-label">2. Select Heartland</label><select class="uk-select" data-creation-key="heartland">${createOptions(KINGDOM_HEARTLANDS, 'forest_swamp')}</select></div>
            <div class="uk-margin"><label class="uk-form-label">3. Select Government</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="government">${createOptions(KINGDOM_GOVERNMENTS, 'feudalism')}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-government-boost-select" data-creation-key="governmentBoost"></select></div></div></div>
            <div class="uk-margin"><label class="uk-form-label">4. Final Free Ability Boosts</label><div class="uk-grid-small" uk-grid><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-1" data-creation-key="freeBoost1"></select></div><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-2" data-creation-key="freeBoost2"></select></div></div></div>
            <div class="uk-margin"><label class="uk-form-label">5. Initial Skill Investments</label><p class="uk-text-meta">Select four different skills to become Trained in.</p><div class="uk-grid-small" uk-grid><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-1" data-creation-key="skillInvest1"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-2" data-creation-key="skillInvest2"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-3" data-creation-key="skillInvest3"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-4" data-creation-key="skillInvest4"></select></div></div></div><hr>
            <h4 class="uk-heading-line"><span>Resulting Base Scores</span></h4>
            <div id="ability-score-results" class="uk-child-width-1-4" uk-grid>
                <div><dl class="uk-description-list"><dt>Culture</dt><dd id="result-culture">10</dd></dl></div>
                <div><dl class="uk-description-list"><dt>Economy</dt><dd id="result-economy">10</dd></dl></div>
                <div><dl class="uk-description-list"><dt>Loyalty</dt><dd id="result-loyalty">10</dd></dl></div>
                <div><dl class="uk-description-list"><dt>Stability</dt><dd id="result-stability">10</dd></dl></div>
            </div>
            <button type="button" id="save-creation-btn" class="uk-button uk-button-primary uk-width-1-1 uk-margin-top">Create and Save Kingdom</button>
            <button type="button" id="cancel-creation-btn" class="uk-button uk-button-danger uk-width-1-1 uk-margin-small-top">Cancel</button>
        </form>
    `;
  },

 saveCreation() {
    ErrorHandler.withErrorHandling(() => {
        const form = document.getElementById("creation-form");
        if (!form) throw new Error("Creation form not found.");

        const getVal = (sel) => form.querySelector(sel)?.value;
        const newKingdomName = getVal('#kingdom-name-input');
        if (!newKingdomName || !newKingdomName.trim()) {
            throw new Error("Kingdom Name cannot be empty.");
        }
        
        // Create a new kingdom object from the default template
        const newKingdomData = JSON.parse(JSON.stringify(DEFAULT_KINGDOM_DATA));
        
        // ===================================================================
        // NEW (THE FIX): Initialize the skills and advancement objects before use.
        // ===================================================================
        newKingdomData.skills = DataService.generateDefaultSkills();
        newKingdomData.advancement = DataService.generateDefaultAdvancement();
        // ===================================================================

        newKingdomData.name = newKingdomName;
        newKingdomData.capital = getVal('#kingdom-capital-input');
        
        // Apply scores and skills from the form
        newKingdomData.baseCulture = parseInt(document.getElementById("result-culture").textContent);
        newKingdomData.baseEconomy = parseInt(document.getElementById("result-economy").textContent);
        newKingdomData.baseLoyalty = parseInt(document.getElementById("result-loyalty").textContent);
        newKingdomData.baseStability = parseInt(document.getElementById("result-stability").textContent);

        // This part will now work correctly because newKingdomData.skills is initialized
        const govKey = getVal('[data-creation-key="government"]');
        const govSkills = KINGDOM_GOVERNMENTS[govKey]?.skills || [];
        govSkills.forEach(skillName => {
            if (newKingdomData.skills[skillName]) newKingdomData.skills[skillName].prof = 1;
        });

        const investedSkills = Array.from({ length: 4 }, (_, i) => getVal(`#skill-invest-${i + 1}`)).filter(Boolean);
        investedSkills.forEach(skillName => {
            if (newKingdomData.skills[skillName]) newKingdomData.skills[skillName].prof = 1;
        });

        // Get the master save state, add the new kingdom, and set it as active
        const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || { kingdoms: {} };
        const newKingdomId = `k_${Date.now()}`;
        
        fullState.kingdoms[newKingdomId] = {
            kingdom: newKingdomData,
            history: [],
            turnData: {}
        };
        fullState.activeKingdomId = newKingdomId;
        
        // Save the entire state back to storage
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
        
        // Exit creation mode and reload the app to cleanly load the new kingdom
        isCreationMode = false;
        ErrorHandler.showSuccess(`"${newKingdomData.name}" has been created!`);
        reinitializeApp(); // Re-initialize the app to load the new kingdom instantly

    }, "Error saving kingdom creation");
  }
};

// ==========================================
// EVENT HANDLERS & LISTENERS
// ==========================================

const EventHandlers = {
  handleResourceUpdate(resource, action) {
    if (action === "increase") kingdom[resource]++;
    else if (action === "decrease") kingdom[resource] = Math.max(0, kingdom[resource] - 1);
    SaveService.save();
    UI.renderKingdomSheet();
  },

  handleLevelUp() {
    if (kingdom.xp < CONFIG.XP_CAP) {
      ErrorHandler.showError("Not enough XP to level up.");
      return;
    }
    ModalService.showLevelUp(kingdom.level + 1);
  },

  handleKingdomInputChange(e) {
    const key = e.target.dataset.key;
    if (!key || !(key in kingdom)) return;
    
    try {
      const value = e.target.type === "number" ? parseInt(e.target.value, 10) || 0 : e.target.value;
      if (key === "level") Validators.validateLevel(value);
      if (key === "name") Validators.validateKingdomName(value);
      kingdom[key] = value;
      SaveService.save();
    } catch (error) {
      ErrorHandler.showError(error.message);
      e.target.classList.add('uk-form-danger');
      setTimeout(() => e.target.classList.remove('uk-form-danger'), 3000);
    }
  },

  handleTurnDataUpdate(e) {
    const { key } = e.target.dataset;
    if (!key) return;
    if (e.target.type === "checkbox") {
      const checked = e.target.checked;
      if (key.startsWith("activity_")) {
        const activityName = key.substring(9).replace(/_/g, " ");
        let category = null;
        for (const cat in KINGDOM_ACTIVITIES) {
          if (KINGDOM_ACTIVITIES[cat].includes(activityName)) { category = cat; break; }
        }

        let allowed = true;
        if (activityName === "Claim Hex") {
          allowed = TurnService.canAttemptClaimHex();
          if (allowed && checked) turnData.claimHexAttempts++;
          else if (!checked && turnData.claimHexAttempts > 0) turnData.claimHexAttempts--;
        } else if (category === "leadership") {
          allowed = TurnService.canAttemptLeadershipActivity();
          if (allowed && checked) turnData.leadershipActivitiesUsed++;
          else if (!checked && turnData.leadershipActivitiesUsed > 0) turnData.leadershipActivitiesUsed--;
        } else if (category === "region") {
          allowed = TurnService.canAttemptRegionActivity();
          if (allowed && checked) turnData.regionActivitiesUsed++;
          else if (!checked && turnData.regionActivitiesUsed > 0) turnData.regionActivitiesUsed--;
        } else if (category === "civic") {
          allowed = TurnService.canAttemptCivicActivity();
          if (allowed && checked) turnData.civicActivitiesUsed++;
          else if (!checked && turnData.civicActivitiesUsed > 0) turnData.civicActivitiesUsed--;
        }

        if (!allowed && checked) {
          e.target.checked = false;
          UIkit.notification({ message: 'No attempts remaining for this activity.', status: 'danger' });
          return;
        }
      }
      turnData[key] = e.target.checked;
    } else if (e.target.type === "number") {
      turnData[key] = parseInt(e.target.value, 10) || 0;
    } else {
      turnData[key] = e.target.value;
    }
  },

initEventListeners() {
    try {
        // --- KINGDOM SHEET EVENT LISTENERS ---
        const kingdomSheetContent = document.getElementById("kingdom-sheet-content");
        if(kingdomSheetContent) {
            kingdomSheetContent.addEventListener("click", (e) => {
                try {
                    const resourceButton = e.target.closest("button[data-resource]");
                    if (resourceButton) {
                        this.handleResourceUpdate(resourceButton.dataset.resource, resourceButton.dataset.action);
                    }
                } catch (error) {
                    console.error("Error in kingdom sheet click handler:", error);
                    ErrorHandler.showError("Failed to update resource. Please try again.");
                }
            });

            kingdomSheetContent.addEventListener("input", (e) => {
                try {
                    const key = e.target.dataset.key;
                    const resource = e.target.dataset.resource;
            
                    if (key && kingdom.hasOwnProperty(key)) {
                        const value = e.target.type === "number" ? parseInt(e.target.value, 10) || 0 : e.target.value;
                        kingdom[key] = value;
                        SaveService.save();
                    }
            
                    if (resource && kingdom.hasOwnProperty(resource)) {
                        let value = parseInt(e.target.value, 10);
                        if (isNaN(value)) value = 0;
                        
                        if (resource !== 'treasury') {
                            const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || { storage: 4 };
                            const bonuses = KingdomService.calculateStructureBonuses();
                            const maxStorage = sizeData.storage + (bonuses.storage[resource] || 0);
                            if (value > maxStorage) {
                                value = maxStorage;
                                e.target.value = value;
                                ErrorHandler.showError(`${resource.charAt(0).toUpperCase() + resource.slice(1)} cannot exceed max storage of ${maxStorage}.`);
                            }
                        }
                        kingdom[resource] = value;
                        SaveService.save();
                    }
                } catch (error) {
                    console.error("Error in kingdom sheet input handler:", error);
                    ErrorHandler.showError("Failed to update value. Please check your input.");
                }
            });
        }

        // --- TURN TRACKER EVENT LISTENERS ---
        const turnTrackerContent = document.getElementById("turn-tracker-content");
        if(turnTrackerContent) {
            turnTrackerContent.addEventListener("click", (e) => {
                try {
                    const targetId = e.target.id;
                    if (targetId === "clear-turn-btn") TurnService.clearTurn();
                    else if (targetId === "save-turn-btn") TurnService.saveTurn();
                    else if (targetId === 'upkeep-roll-resources') TurnService.rollResources();
                    else if (targetId === 'upkeep-pay-consumption') TurnService.payConsumption();
                    else if (targetId === 'upkeep-apply-unrest') TurnService.applyUpkeepEffects();
                    else if (targetId === 'event-check-event') TurnService.checkForEvent();
                } catch (error) {
                    console.error("Error in turn tracker click handler:", error);
                    ErrorHandler.showError("Failed to process turn action. Please try again.");
                }
            });
            
            turnTrackerContent.addEventListener("input", (e) => {
                try {
                    this.handleTurnDataUpdate(e);
                } catch (error) {
                    console.error("Error in turn tracker input handler:", error);
                    ErrorHandler.showError("Failed to update turn data. Please check your input.");
                }
            });
        }
        
        // --- KINGDOM MANAGEMENT EVENT LISTENERS (CONSOLIDATED) ---
        const managementContent = document.getElementById("kingdom-management-content");
        if (managementContent) {
            managementContent.addEventListener("click", (e) => {
                const target = e.target.closest('a, button');
                if (!target) return;
                e.preventDefault();

                try {
                    // Global Actions (Left Panel)
                    if (target.id === 'create-new-kingdom-btn') {
                        isCreationMode = true;
                        UI.renderKingdomManagement();
                    } else if (target.id === 'import-btn') {
                        SaveService.import();
                    } else if (target.id === 'export-btn') {
                        SaveService.export();
                    }

                    // Per-Kingdom Actions (Left Panel)
                    const loadId = target.dataset.loadId;
                    const renameId = target.dataset.renameId;
                    const deleteId = target.dataset.deleteId;

                    if (loadId) {
                        const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
                        fullState.activeKingdomId = loadId;
                        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                        reinitializeApp();
                    } else if (renameId) {
                        const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
                        const currentName = fullState.kingdoms[renameId]?.kingdom.name || "";
                        
                        // Clean up any existing modals before creating new one
                        const existingModal = document.querySelector('.uk-modal.uk-open');
                        if (existingModal) {
                            UIkit.modal(existingModal).hide();
                        }
                        
                        UIkit.modal.prompt('New Kingdom Name:', currentName).then(newName => {
                            if (newName && newName.trim()) {
                                fullState.kingdoms[renameId].kingdom.name = newName.trim();
                                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                                if (fullState.activeKingdomId === renameId) {
                                    kingdom.name = newName.trim();
                                    UI.renderKingdomSheet();
                                }
                                UI.renderKingdomManagement();
                            }
                        }).catch(() => {
                            // User cancelled - no action needed
                        });
                    } else if (deleteId && !target.disabled) {
                        const fullState = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
                        const kingdomToDelete = fullState.kingdoms[deleteId];
                        if (kingdomToDelete) {
                            // Clean up any existing modals before creating new one
                            const existingModal = document.querySelector('.uk-modal.uk-open');
                            if (existingModal) {
                                UIkit.modal(existingModal).hide();
                            }
                            
                            ModalService.showConfirmation(`Are you sure you want to permanently delete "${kingdomToDelete.kingdom.name}"?`, () => {
                                delete fullState.kingdoms[deleteId];
                                if (Object.keys(fullState.kingdoms).length === 0) {
                                    localStorage.removeItem(CONFIG.STORAGE_KEY);
                                    reinitializeApp();
                                } else {
                                    if (fullState.activeKingdomId === deleteId) {
                                        fullState.activeKingdomId = Object.keys(fullState.kingdoms)[0];
                                    }
                                    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(fullState));
                                    reinitializeApp();
                                }
                            });
                        }
                    }

                    // Workspace Actions (Right Panel)
                    if (target.id === 'save-creation-btn') {
                        CreationService.saveCreation();
                    } else if (target.id === 'cancel-creation-btn') {
                        isCreationMode = false;
                        UI.renderKingdomManagement();
                    } else if (target.id === 'kingdom-level-up-btn') {
                        this.handleLevelUp();
                    }
                } catch (error) {
                    console.error("Error in kingdom management click handler:", error);
                    ErrorHandler.showError("Failed to process action. Please try again.");
                }
            });

            managementContent.addEventListener("input", (e) => {
                try {
                    if (e.target.matches("[data-creation-key]")) {
                        CreationService.calculateAndRenderScores();
                    }
                } catch (error) {
                    console.error("Error in kingdom management input handler:", error);
                    ErrorHandler.showError("Failed to update creation data. Please check your input.");
                }
            });
        }

        // --- SETTLEMENTS EVENT LISTENER ---
        const settlementsContent = document.getElementById("settlements-content");
        if(settlementsContent) {
            settlementsContent.addEventListener("click", (e) => {
                try {
                    if (e.target.id === "add-settlement-btn") {
                        SettlementService.addSettlement();
                        return;
                    }
                    
                    const lotButton = e.target.closest(".grid-lot");
                    if (lotButton) {
                        SettlementService.showEditLot(
                            lotButton.dataset.settlementId, 
                            parseInt(lotButton.dataset.lotIndex, 10)
                        );
                        return;
                    }
                    
                    const deleteButton = e.target.closest("[data-delete-settlement-id]");
                    if (deleteButton) {
                        e.preventDefault();
                        e.stopPropagation();
                        SettlementService.deleteSettlement(deleteButton.dataset.deleteSettlementId);
                    }
                } catch (error) {
                    console.error("Error in settlements click handler:", error);
                    ErrorHandler.showError("Failed to process settlement action. Please try again.");
                }
            });
        }

        // --- ARMIES EVENT LISTENER ---
        const armiesContent = document.getElementById("armies-content");
        if(armiesContent) {
            armiesContent.addEventListener("click", (e) => {
                try {
                    if (e.target.id === "add-army-btn") {
                        ArmyService.showArmyModal();
                        return;
                    }
                    
                    const editButton = e.target.closest("[data-edit-army-id]");
                    if (editButton) {
                        ArmyService.showArmyModal(parseInt(editButton.dataset.editArmyId, 10));
                        return;
                    }
                    
                    const deleteButton = e.target.closest("[data-delete-army-id]");
                    if (deleteButton) {
                        ArmyService.deleteArmy(parseInt(deleteButton.dataset.deleteArmyId, 10));
                    }
                } catch (error) {
                    console.error("Error in armies click handler:", error);
                    ErrorHandler.showError("Failed to process army action. Please try again.");
                }
            });
        }
        
        console.log("All event listeners initialized successfully");
        
    } catch (error) {
        console.error("Critical error initializing event listeners:", error);
        ErrorHandler.showError("Failed to initialize some features. Please refresh the page.");
        // Attempt to save current state before potential failure
        try {
            SaveService.save();
        } catch (saveError) {
            console.error("Failed to save state during error recovery:", saveError);
        }
    }
}
  
};

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

function setupAutoSave() {
  setInterval(() => {
    SaveService.save();
  }, CONFIG.AUTOSAVE_INTERVAL);
}

const debouncedRenderAll = debounce(UI.renderAll, CONFIG.DEBOUNCE_DELAY);

function reinitializeApp() {
    ErrorHandler.withErrorHandling(() => {
        SaveService.load(); // Load the active kingdom's data into the state
        UI.renderAll();     // Re-draw the entire UI with the new data
        TurnService.clearTurn(); // Reset the turn tracker
    }, "Failed to re-initialize application state");
}

function initializeApplication() {
  ErrorHandler.withErrorHandling(() => {
    console.log(`Initializing Kingdom Tracker v${CONFIG.VERSION}`);
    SaveService.load();
    UI.renderAll();
    TurnService.clearTurn();
    EventHandlers.initEventListeners();
    CreationService.calculateAndRenderScores();
    setupAutoSave();
    window.addEventListener("beforeunload", SaveService.save);

    if (kingdom.name === "Silverwood") {
      UIkit.notification({
        message: "Welcome! Visit the 'Creation & Advancement' tab to set up your kingdom.",
        status: "primary",
        timeout: CONFIG.NOTIFICATION_TIMEOUT,
      });
    }
    console.log("Kingdom Tracker initialized successfully");
  }, "Failed to initialize Kingdom Tracker");
}



if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeApplication);

  // ==========================================
  // GLOBAL ERROR HANDLING & DEBUGGING
  // ==========================================

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    ErrorHandler.showError("An unexpected error occurred. Your data has been saved.");
    SaveService.save();
  });

  if (typeof window !== "undefined") {
    window.KingdomTracker = {
      kingdom, turnData, history,
      save: SaveService.save,
      renderAll: debouncedRenderAll,
      version: CONFIG.VERSION,
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { KingdomService, AVAILABLE_STRUCTURES };
}
