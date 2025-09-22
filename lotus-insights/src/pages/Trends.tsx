import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
    Legend,
} from "recharts";
import featureLogs from "../data/featureLogs.json.ts";

// --- Aggregate Feature Counts (for Bar Chart) ---
const featureCounts = featureLogs.reduce<Record<string, number>>((acc, log) => {
    acc[log.feature] = (acc[log.feature] || 0) + 1;
    return acc;
}, {});

const featureChartData = Object.entries(featureCounts).map(([feature, count]) => ({
    feature,
    count,
}));

// --- Aggregate Usage Over Time (Monthly, By Feature) ---
function getMonthKey(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Build a map: { month: { feature: count } }
const monthlyFeatureMap: Record<string, Record<string, number>> = {};

featureLogs.forEach((log) => {
    const month = getMonthKey(log.timestamp);
    if (!monthlyFeatureMap[month]) monthlyFeatureMap[month] = {};
    monthlyFeatureMap[month][log.feature] =
        (monthlyFeatureMap[month][log.feature] || 0) + 1;
});

// Convert to array: [{ month, login: 10, transfer: 5, airtime: 7, ... }]
const timeChartData = Object.entries(monthlyFeatureMap)
    .map(([month, features]) => ({
        month,
        ...features,
    }))
    .sort((a, b) => a.month.localeCompare(b.month)); // chronological

// Unique features list for generating <Line /> components dynamically
const uniqueFeatures = Array.from(
    new Set(featureLogs.map((log) => log.feature))
);

const Trends: React.FC = () => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: "#f9f9f9",
                minHeight: "100vh",
                p: 4,
            }}
        >
            {/* Page Title */}
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Usage Trends
            </Typography>

            <Grid container spacing={3}>
                {/* Feature Usage Counts */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 500 }}>
                        <Typography variant="h6" gutterBottom>
                            Feature Usage Counts
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={featureChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="feature" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#1976d2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Usage Over Time (By Feature) */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 500 }}>
                        <Typography variant="h6" gutterBottom>
                            Usage Over Time (Monthly by Feature)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={timeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {uniqueFeatures.map((f, idx) => (
                                    <Line
                                        key={f}
                                        type="monotone"
                                        dataKey={f}
                                        stroke={`hsl(${(idx * 50) % 360}, 70%, 50%)`} // auto colors
                                        strokeWidth={2}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Trends;
