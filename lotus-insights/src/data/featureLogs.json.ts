// src/data/featureLogs.json.ts
import seasons from "./seasons.json";

// Core features (banking + faith features for your app)
const features = [
    "login",
    "fund_transfer",
    "bill_payment",
    "airtime_purchase",
    "travel",
    "savings_goal",
    "loan_request",
    "zakat",
    "quran_daily",
];

// Base weights (higher = more common in daily usage)
const featureWeights: Record<string, number> = {
    login: 120,
    fund_transfer: 80,
    airtime_purchase: 60,
    bill_payment: 40,
    savings_goal: 25,
    loan_request: 15,
    travel: 10,
    zakat: 8,
    quran_daily: 6,
};

// Seasonal boosts (events drive usage spikes)
const seasonalBoosts: Record<string, string[]> = {
    Ramadan: ["quran_daily", "zakat", "airtime_purchase"],
    "Eid al-Fitr": ["fund_transfer", "airtime_purchase"],
    "Eid al-Adha": ["fund_transfer", "airtime_purchase"],
    Christmas: ["fund_transfer", "bill_payment", "travel"],
    "New Year": ["fund_transfer", "bill_payment", "travel"],
    "Back-to-School": ["bill_payment", "loan_request", "savings_goal"],
};

// Pull in all users (from users.json.ts)
const users = Array.from({ length: 100 }, (_, i) => `u${i + 1}`);

// Helpers
function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function weightedRandomFeature(date: Date): string {
    let weightedList: string[] = [];

    // Base weights
    for (const f of features) {
        weightedList.push(...Array(featureWeights[f]).fill(f));
    }

    // Seasonal boosts
    for (const season of seasons) {
        const start = new Date(season.startDate);
        const end = new Date(season.endDate);

        if (date >= start && date <= end) {
            const boosted = seasonalBoosts[season.name] || [];
            boosted.forEach((f) => {
                weightedList.push(...Array(40).fill(f)); // stronger boost than before
            });
        }
    }

    return weightedList[Math.floor(Math.random() * weightedList.length)];
}

// Generate LOTS of logs (more realistic volume for analysis)
const logs = Array.from({ length: 20000 }, (_, i) => {
    const timestamp = randomDate(new Date("2024-01-01"), new Date("2025-12-31"));
    const feature = weightedRandomFeature(timestamp);
    const userId = users[Math.floor(Math.random() * users.length)];
    const sessionId = `session-${Math.floor(Math.random() * 5000)}`;

    return {
        id: `f${i + 1}`,
        userId,
        feature,
        timestamp: timestamp.toISOString(),
        sessionId,
    };
});

export default logs;
