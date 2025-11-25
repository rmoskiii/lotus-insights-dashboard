// This module imports the backend sandbox transactions and normalizes user IDs
// so backend user_21..user_50 map into frontend users u1..u20 using a deterministic mapping.
import backendTxns from './transactions.raw.json';

const mapUserId = (backendId: string) => {
    const match = String(backendId).match(/user_(\d+)/);
    if (!match) return backendId;
    const n = parseInt(match[1], 10);
    const m = ((n - 1) % 20) + 1; // map into 1..20
    return `u${m}`;
}

const transactions = (backendTxns as any[]).map((t) => ({
    ...t,
    userId: mapUserId(t.userId),
}));

export default transactions;
