// src/data/featureLogs.json.ts

// --- 1. Define available features in the app ---
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

// --- 2. Define available users (must match IDs in users.json.ts) ---
const users = ["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10"];

// --- 3. Helper: generate a random date between two bounds ---
function randomDate(start: Date, end: Date) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
}

// --- 4. Helper: pick a random element from an array ---
function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- 5. Generate logs ---
// Here we generate N random usage logs.
// Each log has:
//   - id: unique identifier ("f1", "f2", …)
//   - userId: one of our test users
//   - feature: one of the app features
//   - timestamp: random date between Jan 2024 and Sep 2025
//   - sessionId: random session number (simulating multiple app sessions)
const logs = Array.from({ length: 50 }, (_, i) => {
    const userId = randomItem(users);
    const feature = randomItem(features);
    const timestamp = randomDate(
        new Date("2024-01-01"),
        new Date("2025-09-01")
    ).toISOString();
    const sessionId = `session-${Math.floor(Math.random() * 1000)}`;

    return {
        id: `f${i + 1}`,
        userId,
        feature,
        timestamp,
        sessionId,
    };
});

// --- 6. Export the dummy logs for use in charts/pages ---
export default logs;
