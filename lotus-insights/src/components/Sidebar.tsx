import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240; // sidebar width

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
                },
            }}
        >
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
                                backgroundColor: isActive ? "grey.300" : "inherit",
                                "&:hover": {
                                    backgroundColor: isActive ? "grey.300" : "grey.100",
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
