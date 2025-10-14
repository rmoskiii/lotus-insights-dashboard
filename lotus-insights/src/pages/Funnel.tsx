"use client";

import { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";

// --- Simulated funnel data (percentages represent how many users reach each step)
const funnelData = {
    All: [
        { stage: "Registered", percent: 100 },
        { stage: "Logged In", percent: 88 },
        { stage: "Made First Transaction", percent: 78 },
        { stage: "Recharge (Airtime & Data)", percent: 56 },
        { stage: "Created Savings Goal", percent: 62 },
        { stage: "Travels", percent: 26 },
        { stage: "Mudarabah", percent: 36 },
        { stage: "Refer a Friend", percent: 17 },
        { stage: "Engaged with Quran Daily", percent: 42 },
        { stage: "Used eNaira", percent: 4 },
    ],
    Students: [
        { stage: "Registered", percent: 100 },
        { stage: "Logged In", percent: 90 },
        { stage: "Made First Transaction", percent: 76 },
        { stage: "Recharge (Airtime & Data)", percent: 68 },
        { stage: "Created Savings Goal", percent: 74 },
        { stage: "Travels", percent: 12 },
        { stage: "Mudarabah", percent: 36 },
        { stage: "Refer a Friend", percent: 24 },
        { stage: "Engaged with Quran Daily", percent: 30 },
        { stage: "Used eNaira", percent: 3 },
    ],
    Business: [
        { stage: "Registered", percent: 100 },
        { stage: "Logged In", percent: 92 },
        { stage: "Made First Transaction", percent: 85 },
        { stage: "Recharge (Airtime & Data)", percent: 54 },
        { stage: "Created Savings Goal", percent: 60 },
        { stage: "Travels", percent: 38 },
        { stage: "Mudarabah", percent: 54 },
        { stage: "Refer a Friend", percent: 18 },
        { stage: "Engaged with Quran Daily", percent: 22 },
        { stage: "Used eNaira", percent: 6 },
    ],
    Premium: [
        { stage: "Registered", percent: 100 },
        { stage: "Logged In", percent: 94 },
        { stage: "Made First Transaction", percent: 88 },
        { stage: "Recharge (Airtime & Data)", percent: 60 },
        { stage: "Created Savings Goal", percent: 68 },
        { stage: "Travels", percent: 44 },
        { stage: "Mudarabah", percent: 42 },
        { stage: "Refer a Friend", percent: 16 },
        { stage: "Engaged with Quran Daily", percent: 48 },
        { stage: "Used eNaira", percent: 8 },
    ],
    // --- Elderly segment: lower Mudarabah/Travels/eNaira, higher Quran engagement, steady savings
    Elderly: [
        { stage: "Registered", percent: 100 },
        { stage: "Logged In", percent: 82 },
        { stage: "Made First Transaction", percent: 64 },
        { stage: "Recharge (Airtime & Data)", percent: 40 },
        { stage: "Created Savings Goal", percent: 52 },
        { stage: "Travels", percent: 10 },
        { stage: "Mudarabah", percent: 12 },
        { stage: "Refer a Friend", percent: 10 },
        { stage: "Engaged with Quran Daily", percent: 68 },
        { stage: "Used eNaira", percent: 1 },
    ],
};

export default function Funnel() {
    const theme = useTheme();
    const [segment, setSegment] = useState("All");

    const handleSegmentChange = (event: any) => {
        setSegment(event.target.value);
    };

    const data = funnelData[segment as keyof typeof funnelData];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Adoption Funnel
            </Typography>
            {/* Replaces deprecated `paragraph` prop */}
            <Typography component="p" sx={{ mb: 2 }}>
                Visualizing user progression from registration to deeper engagement across key app features.
            </Typography>

            {/* --- Segment Filter --- */}
            <FormControl sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel id="segment-select-label">User Segment</InputLabel>
                <Select
                    labelId="segment-select-label"
                    value={segment}
                    label="User Segment"
                    onChange={handleSegmentChange}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Students">Students</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                    {/* Elderly option */}
                    <MenuItem value="Elderly">Elderly</MenuItem>
                </Select>
            </FormControl>

            {/* --- Funnel Chart --- */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Adoption Funnel by Stage
                </Typography>

                <Box sx={{ width: "100%", height: 460 }}>
                    <BarChart
                        dataset={data}
                        yAxis={[{ scaleType: "band", dataKey: "stage" }]}
                        series={[
                            {
                                dataKey: "percent",
                                label: "% of Users",
                                color: theme.palette.primary.main,
                            },
                        ]}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, bottom: 30, left: 180 }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Insights: {segment === "All"
                    ? "Recharge and Savings are broadly adopted; Mudarabah and Travels are selective; eNaira remains niche."
                    : segment === "Students"
                        ? "Students show heavy Recharge and Savings adoption with healthy Mudarabah interest; low Travels/eNaira; referrals are promising."
                        : segment === "Business"
                            ? "Business users transact heavily with leading Mudarabah and Travels; Recharge is moderate; Quran and eNaira remain lower."
                            : segment === "Premium"
                                ? "Premium users keep high engagement across Savings, Travels, and Quran; good Mudarabah; modest referrals."
                                : segment === "Elderly"
                                    ? "Elderly users have strong Quran engagement and steady Savings but low Mudarabah/Travels/eNaira—optimize for accessibility and gentle prompts."
                                    : "Select a segment to view insights."}
                </Typography>
            </Paper>
        </Container>
    );
}
