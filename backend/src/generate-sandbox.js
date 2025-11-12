import fs from "fs-extra";
import faker from "faker";
import minimist from "minimist";

// Expanded transaction types to align with season boosts
const types = [
  "Mudarabah",
  "Fund Transfer",
  "Travel",
  "Savings",
  "Zakat",
  "Airtime Purchase",
  "Bill Payment",
  "Loan Request",
  "Quran Daily"
];

const dataDir = "backend/sandbox-data";

// Map boost keys found in seasons.json to transaction type labels
const boostToType = {
  fund_transfer: "Fund Transfer",
  travel: "Travel",
  zakat: "Zakat",
  airtime_purchase: "Airtime Purchase",
  bill_payment: "Bill Payment",
  loan_request: "Loan Request",
  savings_goal: "Savings",
  quran_daily: "Quran Daily"
};

// Default multipliers for boosts (can be tuned)
const defaultMultipliers = {
  zakat: 6,
  travel: 2,
  fund_transfer: 1.5,
  airtime_purchase: 1.5,
  bill_payment: 1.3,
  loan_request: 1.2,
  savings_goal: 1.4,
  quran_daily: 3
};

// Helper: check if a date is within a season
function isDateInSeason(date, season) {
  try {
    const s = new Date(season.startDate);
    const e = new Date(season.endDate);
    return date >= s && date <= e;
  } catch (err) {
    return false;
  }
}

// Weighted random selection helper
function weightedPick(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i];
    if (r <= acc) return items[i];
  }
  return items[items.length - 1];
}

async function main() {
  try {
    console.log('generate-sandbox.js: starting');

    const args = minimist(process.argv.slice(2));
    const userCount = parseInt(args.users || 500);
    const startDate = new Date(args.start || "2025-01-01");
    const endDate = new Date(args.end || "2025-10-31");

    // ensure data dir
    await fs.ensureDir(dataDir);

    // Load seasons metadata if present
    let seasons = [];
    try {
      seasons = await fs.readJson(`${dataDir}/seasons.json`);
      console.log(`Loaded ${seasons.length} seasons`);
    } catch (err) {
      console.warn("No seasons.json found or failed to parse; continuing without seasonal boosts.", err && err.message);
      seasons = [];
    }

    const users = [];
    const transactions = [];

    for (let i = 0; i < userCount; i++) {
      const userId = faker.datatype.uuid();
      users.push({
        _id: userId,
        name: faker.name.findName(),
        email: faker.internet.email(),
        country: faker.address.country(),
        joinedAt: faker.date.between(startDate, endDate)
      });

      const txnCount = faker.datatype.number({ min: 3, max: 15 });
      for (let j = 0; j < txnCount; j++) {
        const createdAt = faker.date.between(startDate, endDate);

        // Determine active seasons for this timestamp
        const activeSeasons = seasons.filter((s) => isDateInSeason(createdAt, s));

        // Build weights for each type based on active seasons
        const weights = types.map(() => 1);

        if (activeSeasons.length > 0) {
          for (const season of activeSeasons) {
            if (!Array.isArray(season.boosts)) continue;
            for (const boostKey of season.boosts) {
              const targetType = boostToType[boostKey];
              if (!targetType) continue;
              const idx = types.indexOf(targetType);
              if (idx === -1) continue;
              const mult = defaultMultipliers[boostKey] || 2;
              weights[idx] *= mult;
            }
          }
        }

        const chosenType = weightedPick(types, weights);

        transactions.push({
          userId,
          type: chosenType,
          amount: faker.finance.amount(50, 5000, 2),
          createdAt,
          seasons: activeSeasons.map((s) => s.id)
        });
      }
    }

    await fs.writeJson(`${dataDir}/users.generated.json`, users, { spaces: 2 });
    await fs.writeJson(`${dataDir}/transactions.generated.json`, transactions, { spaces: 2 });

    console.log(`✅ Generated ${users.length} users and ${transactions.length} transactions (written to users.generated.json and transactions.generated.json).`);
    console.log('generate-sandbox.js: finished');
  } catch (err) {
    console.error('generate-sandbox.js: fatal error', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

main();
