import fs from "fs-extra";
import faker from "faker";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const userCount = parseInt(args.users || 500);
const startDate = new Date(args.start || "2025-01-01");
const endDate = new Date(args.end || "2025-10-31");

const types = ["Mudarabah", "Fund Transfer", "Travel", "Savings"];
const dataDir = "backend/sandbox-data";

await fs.ensureDir(dataDir);

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
    transactions.push({
      userId,
      type: faker.helpers.randomize(types),
      amount: faker.finance.amount(50, 5000, 2),
      createdAt: faker.date.between(startDate, endDate)
    });
  }
}

await fs.writeJson(`${dataDir}/users.json`, users, { spaces: 2 });
await fs.writeJson(`${dataDir}/transactions.json`, transactions, { spaces: 2 });

console.log(`✅ Generated ${users.length} users and ${transactions.length} transactions.`);
