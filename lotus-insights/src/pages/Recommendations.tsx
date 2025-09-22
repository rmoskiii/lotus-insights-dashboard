import React from "react";
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
import users from "../data/users.json";

const Recommendations: React.FC = () => {
    const recs = users.map((u) => ({
        user: u.name,
        recommendation:
            u.segment === "student"
                ? "Promote educational discounts"
                : u.segment === "business"
                    ? "Offer business loan products"
                    : "Provide retirement savings tips",
    }));

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Recommendations
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <List>
                            {recs.map((r, i) => (
                                <ListItem key={i}>
                                    <ListItemText primary={r.user} secondary={r.recommendation} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Recommendations;
