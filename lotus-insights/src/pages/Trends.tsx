"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Paper,
    Stack,
    Button,
    Switch,
    FormControlLabel
} from "@mui/material"
import type { SelectChangeEvent } from '@mui/material/Select'
import { BarChart } from "@mui/x-charts/BarChart"
import { useTheme } from "@mui/material/styles"

// types
type MonthRecord = { month: string; monthKey?: string; [feature: string]: any };

const featureColors = [
    "#1976d2", // Blue
    "#388e3c", // Green
    "#f57c00", // Orange
    "#d32f2f", // Red
    "#7b1fa2", // Purple
    "#0097a7", // Cyan
    "#f9a825", // Amber
    "#689f38", // Light Green
    "#e91e63", // Pink
]

const featureNames: Record<string, string> = {
    login: "Login",
    fund_transfer: "Fund Transfer",
    bill_payment: "Bill Payment",
    airtime_purchase: "Airtime Purchase",
    travel: "Travel",
    savings_goal: "Savings Goal",
    loan_request: "Mudarabah(loans)",
    zakat: "Zakat(Charity)",
    quran_daily: "Quran Daily",
}

export default function FeatureUsageChart() {
    const theme = useTheme()
    const [selectedSegment, setSelectedSegment] = useState<string>("all")

    // data state
    const [users, setUsers] = useState<any[]>([])
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                // try fetching from backend endpoints
                const [uRes, lRes] = await Promise.all([
                    fetch('/api/sandbox/users?limit=5000'),
                    fetch('/api/sandbox/featureLogs?limit=50000')
                ])

                if (!uRes.ok || !lRes.ok) throw new Error('Non-OK response')

                const uJson = await uRes.json()
                const lJson = await lRes.json()

                const fetchedUsers = Array.isArray(uJson.results) ? uJson.results : (uJson || [])
                const fetchedLogs = Array.isArray(lJson.results) ? lJson.results : (lJson || [])

                if (mounted) {
                    setUsers(fetchedUsers)
                    setLogs(fetchedLogs)
                    setLoading(false)
                }
            } catch (err) {
                // fallback to local data imports if fetch fails
                try {
                    const [{ default: localUsers }, { default: localLogs }] = await Promise.all([
                        import('../data/users.json.ts'),
                        import('../data/featureLogs.json')
                    ])
                    if (mounted) {
                        setUsers(localUsers)
                        setLogs(localLogs)
                        setLoading(false)
                    }
                } catch (impErr) {
                    if (mounted) {
                        setError(String(err || impErr))
                        setLoading(false)
                    }
                }
            }
        }
        fetchData()
        return () => { mounted = false }
    }, [])

    const userSegments = useMemo(() => {
        const segments = [...new Set(users.map((user) => user.segment))]
        return ["all", ...segments.sort()]
    }, [users])

    const userSegmentMap = useMemo(() => {
        const map: Record<string, string> = {}
        users.forEach((user) => {
            map[user.id] = user.segment
        })
        return map
    }, [users])

    // helper: month key YYYY-MM
    function monthKeyForDate(d: Date) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    const { chartData, availableFeatures, totalUsage } = useMemo(() => {
        const filtered = selectedSegment === 'all' ? logs : logs.filter((log) => userSegmentMap[log.userId] === selectedSegment)

        // Group by month and feature
        const monthlyData: Record<string, Record<string, number>> = {}

        filtered.forEach((log) => {
            const date = new Date(log.timestamp)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {}
            }

            if (!monthlyData[monthKey][log.feature]) {
                monthlyData[monthKey][log.feature] = 0
            }

            monthlyData[monthKey][log.feature]++
        })

        // Convert to chart format; include monthKey for timeline alignment
        const chartArray = Object.entries(monthlyData)
            .map(([month, features]) => ({
                monthKey: month,
                month: new Date(month + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                }),
                ...features,
            }))
            .sort((a, b) =>
                // sort by monthKey (YYYY-MM) to ensure chronological order
                a.monthKey!.localeCompare(b.monthKey!)
            ) as MonthRecord[]

        // Collect all features
        const features = new Set<string>()
        chartArray.forEach((data) => {
            Object.keys(data).forEach((key) => {
                if (key !== "month" && key !== "monthKey") features.add(key)
            })
        })

        const availableFeatures = Array.from(features).sort()

        // Total usage
        const totalUsage = chartArray.reduce((sum, month) => {
            return (
                sum +
                availableFeatures.reduce((monthSum, feature) => {
                    return monthSum + ((month as any)[feature] || 0)
                }, 0)
            )
        }, 0)

        return { chartData: chartArray, availableFeatures, totalUsage }
    }, [selectedSegment, userSegmentMap, logs])

    const series = useMemo(() => {
        return availableFeatures.map((feature, index) => ({
            dataKey: feature,
            label: featureNames[feature] || feature,
            color: featureColors[index % featureColors.length],
            stack: "usage",
        }))
    }, [availableFeatures])

    if (loading) return <Card sx={{ width: "100%", p: 2 }}><Typography>Loading data…</Typography></Card>
    if (error) return <Card sx={{ width: "100%", p: 2 }}><Typography color="error">Error loading data: {error}</Typography></Card>

    return (
        <Card sx={{ width: "100%", p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <Stack
                    sx={{ flexDirection: { xs: "column", sm: "row" } }}
                    justifyContent="flex-start"
                    alignItems="start"
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Feature Usage Trends
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monthly usage breakdown by feature
                            {selectedSegment !== "all" && ` for ${selectedSegment} segment`}
                        </Typography>
                    </Box>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>User Segment</InputLabel>
                        <Select
                            value={selectedSegment}
                            label="User Segment"
                            onChange={(e: SelectChangeEvent) => setSelectedSegment(e.target.value as string)}
                        >
                            {userSegments.map((segment) => (
                                <MenuItem key={segment} value={segment}>
                                    {segment === "all"
                                        ? "All Segments"
                                        : segment.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                    <Chip
                        label={`Total Usage: ${totalUsage.toLocaleString()}`}
                        variant="outlined"
                        color="primary"
                    />
                    <Chip
                        label={`Time Period: ${chartData.length} months`}
                        variant="outlined"
                        color="secondary"
                    />
                    <Chip
                        label={`Features: ${availableFeatures.length}`}
                        variant="outlined"
                        color="info"
                    />
                </Stack>
            </Box>

            <CardContent sx={{ p: 0 }}>
                <Box sx={{ width: "100%", height: 500 }}>
                    <BarChart
                        dataset={chartData as any}
                        xAxis={[
                            {
                                scaleType: "band",
                                dataKey: "month",
                                tickLabelStyle: {
                                    angle: -45,
                                    textAnchor: "end",
                                },
                            },
                        ]}
                        series={series as any}
                        margin={{ top: 20, right: 40, left: 60, bottom: 60 }}
                        slotProps={{
                            legend: {
                                // cast to any to satisfy the legend prop's Direction type in this chart lib
                                direction: "row" as any,
                                position: { vertical: "top", horizontal: "center" },
                                padding: 0,
                            },
                        }}
                    />
                </Box>
            </CardContent>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Feature Usage Summary
                </Typography>
                <Grid container spacing={2}>
                    {availableFeatures
                        .map((feature) => {
                            const totalFeatureUsage = chartData.reduce(
                                (sum, month) => sum + ((month as any)[feature] || 0),
                                0
                            )
                            const percentage =
                                totalUsage > 0 ? (totalFeatureUsage / totalUsage) * 100 : 0

                            // find color from chart series
                            const seriesConfig = series.find((s) => s.dataKey === feature)
                            const color = seriesConfig?.color || theme.palette.grey[400]

                            return { feature, totalFeatureUsage, percentage, color }
                        })
                        .sort((a, b) => b.totalFeatureUsage - a.totalFeatureUsage)
                        .map(({ feature, totalFeatureUsage, percentage, color }) => (
                            <Grid item xs={12} sm={6} lg={4} key={feature} component="div">
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        border: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            backgroundColor: color,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="medium" noWrap>
                                            {featureNames[feature] || feature}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {totalFeatureUsage.toLocaleString()} uses ({percentage.toFixed(1)}%)
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                </Grid>

                <Box sx={{ mt: 4, pr: 8 }}>
                    <Typography variant="h6" gutterBottom>
                        Observations & Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Feature usage often correlates with <strong>seasonal trends</strong> and
                        <strong> user segments</strong>. For example, travel-related features may peak
                        during holiday seasons, while bill payment and airtime purchases are more stable
                        month-to-month. Segments such as students or salaried workers may also display
                        unique patterns—for instance, higher fund transfers at the end of the month or
                        increased savings goal activity during festive periods.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        These insights suggest that analyzing both <strong>time periods</strong> and
                        <strong> user groups</strong> together provides deeper understanding of user
                        behavior, which can inform product improvements and targeted engagement strategies.
                    </Typography>
                </Box>

            </Box>
        </Card>

    )
}
