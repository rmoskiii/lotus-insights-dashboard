"use client"

import { useState, useMemo } from "react"
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
} from "@mui/material"
import { BarChart } from "@mui/x-charts/BarChart"
import { useTheme } from "@mui/material/styles"
import users from "../data/users.json.ts"
import featureLogsJson from "../data/featureLogs.json"

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
    loan_request: "Loan Request",
    zakat: "Zakat",
    quran_daily: "Quran Daily",
}

export default function FeatureUsageChart() {
    const theme = useTheme()
    const [selectedSegment, setSelectedSegment] = useState<string>("all")

    const userSegments = useMemo(() => {
        const segments = [...new Set(users.map((user) => user.segment))]
        return ["all", ...segments.sort()]
    }, [])

    const userSegmentMap = useMemo(() => {
        const map: Record<string, string> = {}
        users.forEach((user) => {
            map[user.id] = user.segment
        })
        return map
    }, [])

    const { chartData, availableFeatures, totalUsage } = useMemo(() => {
        const logs = featureLogsJson

        // Filter logs by selected segment
        const filteredLogs =
            selectedSegment === "all"
                ? logs
                : logs.filter((log) => userSegmentMap[log.userId] === selectedSegment)

        // Group by month and feature
        const monthlyData: Record<string, Record<string, number>> = {}

        filteredLogs.forEach((log) => {
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

        // Convert to chart format
        const chartArray = Object.entries(monthlyData)
            .map(([month, features]) => ({
                month: new Date(month + "-01").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                }),
                ...features,
            }))
            .sort((a, b) =>
                new Date(a.month).getTime() - new Date(b.month).getTime()
            )

        // Collect all features
        const features = new Set<string>()
        chartArray.forEach((data) => {
            Object.keys(data).forEach((key) => {
                if (key !== "month") features.add(key)
            })
        })

        const availableFeatures = Array.from(features).sort()

        // Total usage
        const totalUsage = chartArray.reduce((sum, month) => {
            return (
                sum +
                availableFeatures.reduce((monthSum, feature) => {
                    return monthSum + (month[feature] || 0)
                }, 0)
            )
        }, 0)

        return { chartData: chartArray, availableFeatures, totalUsage }
    }, [selectedSegment, userSegmentMap])

    const series = useMemo(() => {
        return availableFeatures.map((feature, index) => ({
            dataKey: feature,
            label: featureNames[feature] || feature,
            color: featureColors[index % featureColors.length],
            stack: "usage",
        }))
    }, [availableFeatures])

    return (
        <Card sx={{ width: "100%", p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
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
                            onChange={(e) => setSelectedSegment(e.target.value)}
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
                        dataset={chartData}
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
                        series={series}
                        margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
                        slotProps={{
                            legend: {
                                direction: "row",
                                position: { vertical: "top", horizontal: "middle" },
                                padding: 0,
                            },
                        }}
                    />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Feature Usage Summary
                    </Typography>
                    <Grid container spacing={2}>
                        {availableFeatures
                            .map((feature) => {
                                const totalFeatureUsage = chartData.reduce(
                                    (sum, month) => sum + (month[feature] || 0),
                                    0
                                )
                                const percentage =
                                    totalUsage > 0 ? (totalFeatureUsage / totalUsage) * 100 : 0
                                return { feature, totalFeatureUsage, percentage }
                            })
                            .sort((a, b) => b.totalFeatureUsage - a.totalFeatureUsage)
                            .map(({ feature, totalFeatureUsage, percentage }, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={feature}>
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
                                                backgroundColor:
                                                    featureColors[index % featureColors.length],
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight="medium" noWrap>
                                                {featureNames[feature] || feature}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {totalFeatureUsage.toLocaleString()} uses (
                                                {percentage.toFixed(1)}%)
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    )
}
