import React from "react";
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import users from "../data/users.json";

const Segments: React.FC = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Segments
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Segment</TableCell>
                                    <TableCell>Joined</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.segment}</TableCell>
                                        <TableCell>{u.joined}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Segments;
