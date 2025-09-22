import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

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
            {/* Ensures top spacing (otherwise content touches AppBar if you add one later) */}
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        component={Link}
                        to={item.path}
                        key={item.text}
                    >
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}
