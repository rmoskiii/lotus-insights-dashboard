import React, { useMemo, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Avatar, Chip, Stack, Checkbox } from "@mui/material";
import { useSandboxData, featureNames } from "../lib/useSandboxData";

const NGN = (v: number) => {
    return `₦${(Math.round(v * 100) / 100).toLocaleString()}`;
}

const NOW = new Date()
const DAYS_30 = 1000 * 60 * 60 * 24 * 30

const defaultAssumptions = {
    exchangeRate: 1500, // NGN per 1 USD
    bankTakeRate: 0.015, // 1.5% of spend
    avgEventValueNGN: 10000, // fallback per-event spend
    cashbackRates: {
        cashback_card: 0.01, // 1% cashback
        savings_booster: 0.0,
    } as Record<string, number>,
    conversionLift: {
        cashback_card: 0.10,
        savings_booster: 0.08,
        micro_loan: 0.06,
        travel_insurance: 0.04,
        premium_upgrade: 0.07,
        business_package: 0.09,
        retention_offer: 0.05,
    } as Record<string, number>,
}

const normalizeFeature = (f: string) => {
    if (!f) return f
    const lower = f.toLowerCase()
    if (lower.includes("fund_transfer")) return "fund_transfer"
    if (lower.includes("airtime")) return "airtime_purchase"
    if (lower.includes("bill")) return "bill_payment"
    if (lower.includes("savings")) return "savings_goal"
    if (lower.includes("loan") || lower.includes("mudar")) return "loan_request"
    if (lower.includes("travel")) return "travel"
    if (lower.includes("zakat")) return "zakat"
    if (lower.includes("quran")) return "quran_daily"
    if (lower.includes("login")) return "login"
    return f
}

const productFor = (segment: string | undefined, metrics: any) => {
    const top = metrics.topFeatures || []
    const ev30 = metrics.events30 || 0

    if (segment === "business" && (top.includes("fund_transfer") || ev30 > 5)) {
        return {
            product: "Business Package",
            key: "business_package",
            text: "Promote Business Package: bulk payments, invoicing and lower FX fees.",
            rationale: "High transfer activity and business segment indicate potential value from business tools.",
        }
    }

    if (top.includes("fund_transfer") || top.includes("airtime_purchase")) {
        return {
            product: "Cashback Card",
            key: "cashback_card",
            text: "Offer a cashback card and streamline quick-pay flows for frequent payments.",
            rationale: "Frequent payment behaviour suggests a good fit for cashback incentives to capture spend.",
        }
    }

    if (top.includes("savings_goal") || metrics.uniqueFeatures >= 3 && ev30 >= 2) {
        return {
            product: "Savings Booster",
            key: "savings_booster",
            text: "Surface goal progress nudges and match-savings prompts to increase deposits.",
            rationale: "Active use of savings features and multi-feature engagement shows readiness for saving products.",
        }
    }

    if (top.includes("loan_request")) {
        return {
            product: "Micro-loan Offer",
            key: "micro_loan",
            text: "Present tailored short-term loan offers with quick eligibility checks.",
            rationale: "User is exploring loans — nudging with small offer can improve conversion.",
        }
    }

    if (top.includes("travel")) {
        return {
            product: "Travel Insurance",
            key: "travel_insurance",
            text: "Offer travel insurance and travel-related product bundles.",
            rationale: "Travel searches/purchases indicate strong affinity for travel-related offers.",
        }
    }

    if (metrics.active === false || ev30 === 0) {
        return {
            product: "Retention Offer",
            key: "retention_offer",
            text: "Targeted retention offer: cashback on next transaction or waived fees.",
            rationale: "Low or no recent activity — win-back incentive may re-activate the user.",
        }
    }

    return {
        product: "Personalized Messaging",
        key: "personalized",
        text: "Personalize messaging and micro-offers based on recent activity.",
        rationale: "No single strong signal, use multi-touch personalization.",
    }
}

const Recommendations: React.FC = () => {
    const { users, logs, transactions, loading, error } = useSandboxData();
    const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

    const userSegmentMap = useMemo(() => {
        const map: Record<string, string> = {}
        users.forEach((u) => {
            if (u.id) map[u.id] = u.segment || "unknown"
        })
        return map
    }, [users])

    const userMetrics = useMemo(() => {
        const byUser: Record<string, any> = {}
        logs.forEach((log) => {
            const uid = log.userId
            if (!uid) return // skip malformed log
            const f = normalizeFeature(log.feature)
            const time = new Date(log.timestamp)
            byUser[uid] = byUser[uid] || { totalEvents: 0, features: {}, lastEvent: null, timestamps: [] }
            byUser[uid].totalEvents += 1
            byUser[uid].features[f] = (byUser[uid].features[f] || 0) + 1
            if (!isNaN(time.getTime())) {
                byUser[uid].timestamps.push(time.getTime())
                if (!byUser[uid].lastEvent || time.getTime() > byUser[uid].lastEvent.getTime()) {
                    byUser[uid].lastEvent = time
                }
            }
        })

        // also include transactions per user (30d sum and count)
        transactions.forEach((t: any) => {
            const uid = t.userId
            if (!uid) return // skip malformed txn
            const time = t.createdAt ? new Date(t.createdAt) : null
            byUser[uid] = byUser[uid] || { totalEvents: 0, features: {}, lastEvent: null, timestamps: [] }
            // ensure txAmounts exists on the object (logs may have created the entry without txAmounts)
            if (!byUser[uid].txAmounts) byUser[uid].txAmounts = []
            if (time) {
                if (!isNaN(time.getTime())) {
                    byUser[uid].txAmounts.push({ amount: t.amount, currency: t.currency || 'USD', ts: time.getTime() })
                }
            }
        })

        const result: Record<string, any> = {}
        Object.entries(byUser).forEach(([uid, v]) => {
            const total = v.totalEvents
            const timestamps: number[] = v.timestamps || []
            const last = v.lastEvent
            const events30 = timestamps.filter((t: number) => NOW.getTime() - t <= DAYS_30).length
            const uniqueFeatures = Object.keys(v.features || {}).length
            const sortedFeatures = Object.entries(v.features || {}).sort((a: any, b: any) => b[1] - a[1]).map((e: any) => e[0])
            const recencyDays = last ? Math.max(1, Math.round((NOW.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))) : 999

            // transactions
            const txs: any[] = (v.txAmounts || []).filter((x: any) => NOW.getTime() - x.ts <= DAYS_30)
            const tx30_count = txs.length
            // convert USD amounts to NGN using exchangeRate
            const tx30_sum_ngn = txs.reduce((acc: number, t: any) => acc + ((t.currency === 'USD' ? t.amount : t.amount) * defaultAssumptions.exchangeRate), 0)

            result[uid] = {
                totalEvents: total,
                events30,
                uniqueFeatures,
                topFeatures: sortedFeatures,
                lastEvent: last,
                avgRecencyDays: recencyDays,
                tx30_count,
                tx30_sum_ngn,
            }
        })

        return result
    }, [logs, transactions])

    const recs = useMemo(() => {
        return users.map((u) => {
            const seg = u.segment || userSegmentMap[u.id] || "unknown"
            const metrics = userMetrics[u.id] || { totalEvents: 0, events30: 0, uniqueFeatures: 0, topFeatures: [], lastEvent: null, tx30_count: 0, tx30_sum_ngn: 0 }
            const product = productFor(seg, { ...metrics, active: (u as any).active })

            // compute bank uplift (NGN)
            const hasTx = (metrics.tx30_count || 0) > 0
            const lift = defaultAssumptions.conversionLift[product.key] || 0.05
            const bankUplift = hasTx
                ? metrics.tx30_sum_ngn * lift * defaultAssumptions.bankTakeRate
                : metrics.events30 * defaultAssumptions.avgEventValueNGN * lift * defaultAssumptions.bankTakeRate

            // compute user benefit (cashback) in NGN — only meaningful for cashback_card
            const cashbackRate = defaultAssumptions.cashbackRates[product.key] || 0
            const userBenefit = hasTx
                ? metrics.tx30_sum_ngn * cashbackRate * lift
                : metrics.events30 * defaultAssumptions.avgEventValueNGN * cashbackRate * lift

            return {
                id: u.id,
                user: u.name,
                segment: seg,
                top: metrics.topFeatures || [],
                metrics,
                recommendation: product,
                bankUplift,
                userBenefit,
                dataSource: hasTx ? 'transactions' : 'heuristic',
            }
        })
    }, [users, userMetrics, userSegmentMap, transactions])

    const sortedRecs = useMemo(() => recs.slice().sort((a, b) => b.bankUplift - a.bankUplift), [recs])
    const displayRecs = sortedRecs.slice(0, 12) // show a representative selection (top 12 by estimated opportunity)

    const toggleSelect = (id: string) => {
        setSelectedMap((s) => ({ ...s, [id]: !s[id] }))
    }

    const selectedIds = Object.entries(selectedMap).filter(([, v]) => v).map(([k]) => k)
    const selectedCount = selectedIds.length
    const selectedBankOpportunity = selectedIds.reduce((acc, id) => {
        const r = recs.find((x) => x.id === id)
        return acc + (r ? r.bankUplift : 0)
    }, 0)
    const selectedUserBenefit = selectedIds.reduce((acc, id) => {
        const r = recs.find((x) => x.id === id)
        return acc + (r ? r.userBenefit : 0)
    }, 0)

    if (loading) {
        return (
            <Box pt={0} px={3} pb={2}>
                <Typography variant="h4" color="text.primary">
                    Recommendations
                </Typography>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box pt={0} px={3} pb={2}>
                <Typography variant="h4" color="text.primary">
                    Recommendations
                </Typography>
                <Typography color="error">Error loading data: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box pt={0} px={3} pb={2}>
            <Typography variant="h4" color="text.primary">
                Recommendations
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Showing personalized product recommendations for a representative set of users (top 12 by estimated opportunity). Select a few users to see combined opportunity for a small campaign pilot.
            </Typography>

            {/* Assumptions panel: make exchange rate and knobs visible for realism */}
            <Paper sx={{ p: 0.75, px: 1.5, mt: 2, mb: 2, display: 'flex', gap: 1.25, alignItems: 'center' }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">Exchange rate</Typography>
                    <Typography variant="subtitle1">1 USD = {NGN(defaultAssumptions.exchangeRate)}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Bank take rate</Typography>
                    <Typography variant="subtitle1">{(defaultAssumptions.bankTakeRate * 100).toFixed(2)}%</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Avg event value (fallback)</Typography>
                    <Typography variant="subtitle1">{NGN(defaultAssumptions.avgEventValueNGN)}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Notes</Typography>
                    <Typography variant="subtitle2">Values are assumptions used to convert USD tx amounts and compute NGN estimates. Transaction-based numbers are preferred.</Typography>
                </Box>
            </Paper>

            {/* selection summary */}
            <Box sx={{ mt: 1.5, mb: 1.5, display: 'flex', gap: 1.25, alignItems: 'center' }}>
                <Paper sx={{ p: 0.75, px: 1.25 }}>
                    <Typography variant="subtitle2">Selected users</Typography>
                    <Typography variant="h6">{selectedCount}</Typography>
                </Paper>
                <Paper sx={{ p: 0.75, px: 1.25 }}>
                    <Typography variant="subtitle2">Combined bank opportunity</Typography>
                    <Typography variant="h6" color="primary">{NGN(selectedBankOpportunity)}</Typography>
                </Paper>
                <Paper sx={{ p: 0.75, px: 1.25 }}>
                    <Typography variant="subtitle2">Combined user benefit</Typography>
                    <Typography variant="h6">{NGN(selectedUserBenefit)}</Typography>
                </Paper>
            </Box>

            {/* grid layout */}
            {/* tightened layout: smaller gap and narrower min card width to fit more cards without scrolling */}
            <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {displayRecs.map((r) => {
                    const initials = r.user
                        .split(" ")
                        .map((p: string) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()

                    return (
                        <Paper key={r.id} sx={{ p: 0.75, boxShadow: 2, position: 'relative' }}>
                            {/* reduced internal spacing: smaller stack spacing and avatar */}
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <Avatar sx={{ width: 30, height: 30, fontSize: 12 }}>{initials}</Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography noWrap fontWeight={700} sx={{ fontSize: '0.9rem' }}>{r.user}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {r.segment.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Typography>
                                </Box>
                                <Checkbox checked={selectedMap[r.id]} onChange={() => toggleSelect(r.id)} size="small" />
                            </Stack>

                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {r.top && r.top.length ? (
                                    r.top.slice(0, 3).map((f: string) => (
                                        <Chip key={f} label={featureNames[f] || f} size="small" color="primary" sx={{ fontSize: '0.65rem', height: 22 }} />
                                    ))
                                ) : (
                                    <Chip label="No recent activity" size="small" sx={{ height: 22 }} />
                                )}

                                <Chip label={`Events: ${r.metrics.events30}`} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />
                                <Chip label={`Diversity: ${r.metrics.uniqueFeatures}`} size="small" sx={{ fontSize: '0.65rem', height: 22 }} />
                            </Box>

                            <Typography variant="body2" sx={{ mt: 0.4 }} color="text.primary">
                                <strong>{r.recommendation.product}</strong> — {r.recommendation.text}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block' }}>
                                {r.recommendation.rationale}
                            </Typography>

                            <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="caption">Est. bank revenue / month</Typography>
                                    <Typography variant="subtitle2" color="primary">{NGN(r.bankUplift)}</Typography>
                                    <Typography variant="caption" color="text.secondary">{r.dataSource === 'transactions' ? 'Transaction-based' : 'Heuristic'}</Typography>
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption">Est. user benefit</Typography>
                                    <Typography variant="subtitle2">{NGN(r.userBenefit)}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    )
                })}
            </Box>

        </Box>
    );
}

export default Recommendations;
