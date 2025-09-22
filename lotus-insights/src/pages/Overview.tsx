import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import users from "../data/users.json";
import featureLogs from "../data/featureLogs.json";
import seasons from "../data/seasons.json";

const Overview: React.FC = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Overview
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Users</Typography>
                        <Typography variant="h3">{users.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Feature Logs</Typography>
                        <Typography variant="h3">{featureLogs.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Active Seasons</Typography>
                        <Typography variant="h3">{seasons.length}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Overview;
