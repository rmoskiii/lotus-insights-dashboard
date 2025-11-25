import React from "react";
import { Box, Typography, Paper, Avatar, Chip, Stack } from "@mui/material";
import users from "../data/users.json";

const Segments: React.FC = () => {
    return (
        <Box p={2} color="text.primary">
            <Typography variant="h4" gutterBottom>
                Segments
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Users by segment — responsive grid view for quick inspection and selection.
            </Typography>

            <Box sx={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {users.map((u: any) => {
                    const initials = (u.name || '')
                        .split(' ')
                        .map((p: string) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                    return (
                        <Paper key={u.id} sx={{ p: 1.25, boxShadow: 2 }}>
                            <Stack direction="row" spacing={1.25} alignItems="center">
                                <Avatar sx={{ width: 40, height: 40, fontSize: 14 }}>{initials}</Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography noWrap fontWeight={700} sx={{ fontSize: '0.95rem' }}>{u.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {String(u.segment || 'unknown').replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 1.25, display: 'flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                                <Chip label={`Joined: ${u.joined || '—'}`} size="small" />
                                <Chip label={u.active ? 'Active' : 'Inactive'} color={u.active ? 'success' : 'default'} size="small" />
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default Segments;
