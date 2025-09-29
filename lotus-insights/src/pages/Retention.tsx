"use client"

import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Grid,
    Paper,
} from "@mui/material"
import { BarChart, LineChart } from "@mui/x-charts"
import { useTheme } from "@mui/material/styles"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// --- Feature → Retention Correlation ---
// Inline dummy data to simulate impact of different features on retention
const featureRetention = [
    { feature: "Savings Goal", retention: 72 },
    { feature: "Fund Transfer", retention: 60 },
    { feature: "Bill Payment", retention: 54 },
    { feature: "Airtime Purchase", retention: 48 },
    { feature: "Loan Request", retention: 42 },
    { feature: "Travel", retention: 38 },
    { feature: "Zakat", retention: 50 },
    { feature: "Quran Daily", retention: 58 },
]

// --- Retention by User Segment ---
const segmentRetention = [
    // declining groups
    { segment: "Students", month1: 45, month3: 28, month6: 18 },
    { segment: "Family", month1: 55, month3: 40, month6: 25 },
    { segment: "Elderly", month1: 50, month3: 32, month6: 20 },

    // growing / stable groups
    { segment: "Young Professionals", month1: 65, month3: 72, month6: 78 },
    { segment: "Business", month1: 60, month3: 68, month6: 75 },
    { segment: "Premium", month1: 70, month3: 76, month6: 82 },
]


// --- Engagement Depth → Retention ---
// Clearer buckets showing higher retention for broader feature adoption
const engagementDepth = [
    { featuresUsed: "1 feature", retention: 35 },
    { featuresUsed: "2 features", retention: 52 },
    { featuresUsed: "3 features", retention: 68 },
    { featuresUsed: "4+ features", retention: 80 },
]

// --- Churn Prediction Signals ---
// Inline dummy signals with % risk values for storytelling
const churnSignals = [
    { signal: "No activity in first 14 days", risk: "65% churn risk (2× higher)" },
    { signal: "Never set up a savings goal", risk: "55% churn risk (1.8× higher)" },
    { signal: "One-time loan request only", risk: "50% churn risk (1.5× higher)" },
    { signal: "Only used airtime top-up", risk: "48% churn risk (1.4× higher)" },
    { signal: "No bill payment in first month", risk: "45% churn risk (1.3× higher)" },
    { signal: "No usage of fund transfer feature", risk: "52% churn risk (1.6× higher)" },
    { signal: "Never used rewards or offers", risk: "40% churn risk (1.2× higher)" },
]

export default function Retention() {
    const theme = useTheme()
    const [tab, setTab] = useState(0)

    return (
        <Card sx={{ width: "100%", p: 2 }}>
            {/* --- Hero Section: Feature → Retention Correlation --- */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Feature → Retention Correlation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Comparing retention rates of users who engage with different features.
                </Typography>

                <Box sx={{ width: "100%", height: 400 }}>
                    <BarChart
                        dataset={featureRetention}
                        xAxis={[
                            {
                                scaleType: "band",
                                dataKey: "feature",
                                tickLabelStyle: { angle: -25, textAnchor: "end" },
                            },
                        ]}
                        series={[
                            {
                                dataKey: "retention",
                                label: "Retention %",
                                color: theme.palette.primary.main,
                            },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, pr: 2 }}
                >
                    Insights: <strong>Savings Goal</strong> and <strong>Quran
                    Daily</strong> users show the strongest long-term retention, while
                    transactional features such as Airtime Purchases are more neutral.
                </Typography>
            </Box>

            {/* --- Tabs for deeper insights --- */}
            <Tabs
                value={tab}
                onChange={(_, newValue) => setTab(newValue)}
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tab label="By User Segment" />
                <Tab label="Engagement Depth" />
                <Tab label="Churn Signals" />
            </Tabs>

            <CardContent>

                {/* --- Retention by User Segment --- */}
                {tab === 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Retention by User Segment
                        </Typography>
                        <Box sx={{ width: "100%", height: 400 }}>
                            <LineChart
                                xAxis={[
                                    {
                                        data: segmentRetention.map((s) => s.segment), // Segments on X-axis
                                        scaleType: "band",
                                    },
                                ]}
                                series={[
                                    {
                                        label: "Month 1",
                                        data: segmentRetention.map((s) => s.month1),
                                        showMark: true,
                                    },
                                    {
                                        label: "Month 3",
                                        data: segmentRetention.map((s) => s.month3),
                                        showMark: true,
                                    },
                                    {
                                        label: "Month 6",
                                        data: segmentRetention.map((s) => s.month6),
                                        showMark: true,
                                    },
                                ]}
                                height={400}
                                slotProps={{
                                    legend: { position: { vertical: "bottom", horizontal: "middle" } },
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Premium and business users strengthen their retention from Month 1 to Month 6, suggesting
                            effective engagement, while family and student users fall off more sharply — a clear
                            opportunity for targeted interventions.
                        </Typography>
                    </Box>
                )}

                {/* --- Engagement Depth → Retention --- */}
                {tab === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Engagement Depth → Retention
                        </Typography>
                        <Box sx={{ width: "100%", height: 400 }}>
                            <BarChart
                                dataset={engagementDepth}
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        dataKey: "featuresUsed",
                                    },
                                ]}
                                series={[
                                    {
                                        dataKey: "retention",
                                        label: "Retention %",
                                        color: theme.palette.success.main,
                                    },
                                ]}
                                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Insights: Users engaging with 3+ features retain significantly
                            longer, highlighting the value of cross-feature adoption strategies.
                        </Typography>
                    </Box>
                )}

                {/* --- Churn Prediction Signals --- */}
                {tab === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Churn Prediction Signals
                        </Typography>
                        <Grid container spacing={2}>
                            {churnSignals.map((signal, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Paper
                                        sx={{ p: 2, border: 1, borderColor: "divider" }}
                                    >
                                        <Typography variant="body2" fontWeight="medium">
                                            {signal.signal}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {signal.risk}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Insights: Early inactivity and single-feature usage patterns are
                            strong churn predictors. Targeted nudges at these points could reduce
                            churn by up to 20%.
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}
