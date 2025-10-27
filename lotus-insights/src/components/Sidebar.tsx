import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Group 653 1.png";

const drawerWidth = 240; // sidebar width
const primaryBlue = "#1C219F";
const accentCyan = "#00CECE";

const menuItems = [
    { text: "Overview", path: "/" },
    { text: "Trends", path: "/trends" },
    { text: "Segments", path: "/segments" },
    { text: "Retention", path: "/retention" },
    { text: "Funnel", path: "/funnel" },
    { text: "Recommendations", path: "/recommendations" },
];

export default function Sidebar() {
    const location = useLocation(); // Get current path

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: primaryBlue,
                },
            }}
        >
            {/* Logo at the top */}
            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            </Box>

            {/* Top spacing */}
            <Toolbar />

            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            key={item.text}
                            sx={{
                                backgroundColor: isActive ? accentCyan : "transparent",
                                color: isActive ? primaryBlue : "white",
                                "&:hover": {
                                    backgroundColor: isActive ? accentCyan : "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Drawer>
    );
}