import { Container, Typography, Grid, Paper } from "@mui/material";

export default function Funnel() {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Funnel
            </Typography>
            <Typography paragraph>
                Explore feature adoption order and drop-offs.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Adoption Funnel</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
