import { useEffect, useState } from "react";

export type User = { id: string; name: string; segment?: string };
export type FeatureLog = { userId: string; feature: string; timestamp: string };
export type Transaction = { id: string; userId: string; amount: number; currency?: string; createdAt?: string };

export const featureNames: Record<string, string> = {
  login: "Login",
  fund_transfer: "Fund Transfer",
  bill_payment: "Bill Payment",
  airtime_purchase: "Airtime Purchase",
  travel: "Travel",
  savings_goal: "Savings Goal",
  loan_request: "Mudarabah (loans)",
  zakat: "Zakat (Charity)",
  quran_daily: "Quran Daily",
};

export function useSandboxData() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<FeatureLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadLocalData() {
      setLoading(true);
      setError(null);
      try {
        // Directly import local sandbox data for frontend-only demo (no network calls)
        const [{ default: localUsers }, { default: localLogs }, { default: localTxns }] = await Promise.all([
          import("../data/users.json.ts"),
          import("../data/featureLogs.json"),
          import("../data/transactions.json.ts"),
        ]);

        if (mounted) {
          setUsers(localUsers as any);
          setLogs(localLogs as any);
          setTransactions(localTxns as any);
          setLoading(false);
        }
      } catch (impErr) {
        if (mounted) {
          setError(String(impErr));
          setLoading(false);
        }
      }
    }

    loadLocalData();
    return () => {
      mounted = false;
    };
  }, []);

  return { users, logs, transactions, loading, error } as const;
}
