// src/data/featureLogs.json.ts

import seasons from "./seasons.json";

const features = [
    "login",
    "fund_transfer",
    "bill_payment",
    "airtime_purchase",
    "travel",
    "savings_goal",
    "Mudarabah(loans)",
    "zakat",
    "quran_daily",
];

// Assign weights to simulate real-world frequency
const featureWeights: Record<string, number> = {
    login: 40,
    fund_transfer: 20,
    airtime_purchase: 15,
    bill_payment: 10,
    savings_goal: 5,
    loan_request: 3,
    travel: 3,
    zakat: 2,
    quran_daily: 2,
};

// Seasonal boosts
const seasonalBoosts: Record<string, string[]> = {
    Ramadan: ["quran_daily", "zakat", "airtime_purchase"],
    "Eid al-Fitr": ["fund_transfer", "airtime_purchase"],
    "Eid al-Adha": ["fund_transfer", "airtime_purchase"],
    Christmas: ["fund_transfer", "bill_payment", "travel"],
    "New Year": ["fund_transfer", "bill_payment", "travel"],
    "Back-to-School": ["bill_payment", "loan_request", "savings_goal"],
};

const users = Array.from({ length: 30 }, (_, i) => `u${i + 1}`);

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
                weightedList.push(...Array(10).fill(f)); // +10 weight boost
            });
        }
    }

    return weightedList[Math.floor(Math.random() * weightedList.length)];
}

const logs = Array.from({ length: 1000 }, (_, i) => {
    const timestamp = randomDate(new Date("2024-01-01"), new Date("2025-09-01"));
    const feature = weightedRandomFeature(timestamp);
    const userId = users[Math.floor(Math.random() * users.length)];
    const sessionId = `session-${Math.floor(Math.random() * 1000)}`;

    return {
        id: `f${i + 1}`,
        userId,
        feature,
        timestamp: timestamp.toISOString(),
        sessionId,
    };
});

export default logs;
