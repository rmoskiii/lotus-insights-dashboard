import { AppBar, Toolbar, Typography } from "@mui/material";

export default function NavBar() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6">Lotus Insights Dashboard</Typography>
            </Toolbar>
        </AppBar>
    );
}
