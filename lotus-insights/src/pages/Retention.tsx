import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import users from "../data/users.json";

const Retention: React.FC = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Retention
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography>
                            (Placeholder) Retention analysis using {users.length} users.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Retention;
