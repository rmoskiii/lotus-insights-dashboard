import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const Overview: React.FC = () => {
    return (
        <Box pt={0} px={2} pb={2} color="text.primary">
            <Typography variant="h4">
                Overview
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Welcome to Lotus Insights. This workspace helps you understand how customers discover, adopt, and
                    keep using key mobile app features like Recharge, Savings Goals, Travels, Mudarabah (Islamic financing),
                    Quran engagement, and eNaira. View the sections below as brief overviews into the tabbed sections in the sidebar.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                    Sections at a glance
                </Typography>

                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    <Box component="li" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            Trends
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Track how feature usage changes over time. Spot seasonal spikes (e.g., Ramadan or Eid),
                            weekly patterns, and the impact of campaigns. Great for planning promos and monitoring
                            outcomes.
                        </Typography>
                    </Box>

                    <Box component="li" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            Segments
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            An overview of dummy customers. Other sections (trends, retention etc) will have a segments
                            filter to Compare behavior across Students, Business, Premium, and Elderly.
                        </Typography>
                    </Box>

                    <Box component="li" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            Retention
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Understand stickiness with cohort views (e.g., week‑over‑week return rates). Find where
                            users fall off and which features correlate with better retention to prioritize lifecycle
                            nudges.
                        </Typography>
                    </Box>

                    <Box component="li" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            Funnel
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            See adoption across key stages from Registration to deeper engagement (Recharge, Savings
                            Goals, Travels, Mudarabah, Refer a Friend, Quran, eNaira). Compare by segment to identify
                            drop‑offs and quick wins. Note: “Mudarabah” replaces conventional loans.
                        </Typography>
                    </Box>

                    <Box component="li" sx={{ mb: 0 }}>
                        <Typography variant="subtitle1" component="div" fontWeight={600}>
                            Recommendations
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Review data‑driven suggestions to improve adoption and retention—for example, nudging
                            Savings Goals for Students or promoting Mudarabah for Business users during cash‑flow periods.
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                    Notes: “All” provides a broad baseline; eNaira adoption is currently niche; percentages in Funnel
                    reflect feature adoption, not necessarily a strict step‑by‑step path.
                </Typography>
            </Paper>
        </Box>
    );
};

export default Overview;
