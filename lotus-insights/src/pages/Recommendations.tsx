import React, { useMemo } from "react";
import { Box, Typography, Paper, CircularProgress, Avatar, Chip, Stack, Button } from "@mui/material";
import { useSandboxData, featureNames } from "../lib/useSandboxData";

const Recommendations: React.FC = () => {
    const { users, logs, loading, error } = useSandboxData();

    // compute helper maps for segments and top features per segment
    const userSegmentMap = useMemo(() => {
        const map: Record<string, string> = {}
        users.forEach((u) => {
            if (u.id) map[u.id] = u.segment || "unknown"
        })
        return map
    }, [users])

    const topFeaturesBySegment = useMemo(() => {
        const counts: Record<string, Record<string, number>> = {}
        logs.forEach((log) => {
            const seg = userSegmentMap[log.userId] || "unknown"
            counts[seg] = counts[seg] || {}
            counts[seg][log.feature] = (counts[seg][log.feature] || 0) + 1
        })

        const topBySeg: Record<string, string[]> = {}
        Object.entries(counts).forEach(([seg, feats]) => {
            const sorted = Object.entries(feats)
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                .map((e) => e[0])
            topBySeg[seg] = sorted.slice(0, 3)
        })
        return topBySeg
    }, [logs, userSegmentMap])

    // Simplified, prioritized recommendation rules:
    // - Cashback for fund_transfer and airtime_purchase
    // - Savings nudges for savings_goal
    // - Loan guidance for loan_request
    // - Segment-level suggestions (student/business)
    // No recommendations about "login" since it's necessary to use the app.
    function recommendationFor(segment: string | undefined, topFeatures: string[]) {
        if (topFeatures.includes("fund_transfer") || topFeatures.includes("airtime_purchase")) {
            return "Offer targeted cashback and quick-pay flows for frequently used payment features."
        }
        if (topFeatures.includes("savings_goal")) {
            return "Surface goal progress nudges and match-savings prompts to increase deposits."
        }
        if (topFeatures.includes("loan_request")) {
            return "Present short educational flows and tailored micro-loan offers."
        }
        if (segment === "student") return "Promote student discounts & low-fee saving plans."
        if (segment === "business") return "Highlight business tools and bulk payment features."
        return "Personalize messaging based on top activities for this user."
    }

    const recs = users.map((u) => {
        const seg = u.segment || userSegmentMap[u.id] || "unknown"
        const top = topFeaturesBySegment[seg] || []
        return {
            id: u.id,
            user: u.name,
            segment: seg,
            top,
            recommendation: recommendationFor(seg, top),
        }
    })

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
            {/* Split into 2 rows so layout is always two rows using available width */}
            {(() => {
                const half = Math.ceil(recs.length / 2)
                const rows = [recs.slice(0, half), recs.slice(half)]
                // Wrap rows in a horizontally-scrollable container to avoid page overflow
                return (
                    <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'visible', mt: 1 }}>
                        {rows.map((row, rowIdx) => (
                            // each row is a horizontally laid out list; keep items single-line and scrollable
                            <Box key={rowIdx} sx={{ display: 'flex', gap: 2, mt: rowIdx === 0 ? 0 : 1, flexWrap: 'nowrap', alignItems: 'stretch' }}>
                                {row.length === 0 ? (
                                    <Box sx={{ flex: 1 }} />
                                ) : (
                                    row.map((r) => {
                                        const initials = r.user
                                            .split(" ")
                                            .map((p: string) => p[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase()

                                        return (
                                            // use a fixed base card width to make horizontal scroll predictable; allow growth on wide screens
                                            <Box key={r.id || r.user} sx={{ flex: '0 0 260px', minWidth: 260 }}>
                                                <Paper sx={{ p: 3, height: '100%', boxShadow: 3, position: 'relative', zIndex: 1 }}>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar sx={{ width: 44, height: 44, fontSize: 18 }}>{initials}</Avatar>
                                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                            <Typography noWrap fontWeight={700} sx={{ fontSize: '1.05rem' }}>{r.user}</Typography>
                                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                                {r.segment.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {r.top && r.top.length ? (
                                                            r.top.slice(0, 2).map((f: string) => (
                                                                <Chip key={f} label={featureNames[f] || f} size="small" color="primary" />
                                                            ))
                                                        ) : (
                                                            <Chip label="No recent activity" size="small" />
                                                        )}
                                                    </Box>

                                                    <Typography variant="body1" sx={{ mt: 2 }} color="text.primary">
                                                        {r.recommendation}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="flex-end">
                                                        <Button size="medium" variant="contained">Apply Campaign</Button>
                                                    </Stack>
                                                </Paper>
                                            </Box>
                                        )
                                    })
                                )}
                            </Box>
                        ))}
                    </Box>
                )
            })()}
         </Box>
     );
 }

 export default Recommendations;
