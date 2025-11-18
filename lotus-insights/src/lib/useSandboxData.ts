import { useEffect, useState } from "react";

export type User = { id: string; name: string; segment?: string };
export type FeatureLog = { userId: string; feature: string; timestamp: string };

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [uRes, lRes] = await Promise.all([
          fetch("/api/sandbox/users?limit=5000"),
          fetch("/api/sandbox/featureLogs?limit=50000"),
        ]);

        if (!uRes.ok || !lRes.ok) throw new Error("Non-OK response");

        const uJson = await uRes.json();
        const lJson = await lRes.json();

        const fetchedUsers = Array.isArray(uJson.results) ? uJson.results : uJson || [];
        const fetchedLogs = Array.isArray(lJson.results) ? lJson.results : lJson || [];

        if (mounted) {
          setUsers(fetchedUsers);
          setLogs(fetchedLogs);
          setLoading(false);
        }
      } catch (err) {
        try {
          const [{ default: localUsers }, { default: localLogs }] = await Promise.all([
            import("../data/users.json.ts"),
            import("../data/featureLogs.json"),
          ]);
          if (mounted) {
            setUsers(localUsers);
            setLogs(localLogs);
            setLoading(false);
          }
        } catch (impErr) {
          if (mounted) {
            setError(String(err || impErr));
            setLoading(false);
          }
        }
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return { users, logs, loading, error } as const;
}

