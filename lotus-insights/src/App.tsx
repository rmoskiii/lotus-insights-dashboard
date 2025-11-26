import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./components/Sidebar";

import Overview from "./pages/Overview";
import Trends from "./pages/Trends";
import Segments from "./pages/Segments";
import Retention from "./pages/Retention";
import Funnel from "./pages/Funnel";
import Recommendations from "./pages/Recommendations";

const drawerWidth = 240;

function MainContent() {
    const location = useLocation();

    // Pages that should have full width (no padding)
    // Added '/' and '/recommendations' so Overview and Recommendations don't get extra Toolbar spacing above the header
    const fullWidthPages = ['/', '/trends', '/segments', '/retention', '/funnel', '/recommendations'];
    const isFullWidth = fullWidthPages.includes(location.pathname);

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                p: isFullWidth ? 0 : 3,
                minHeight: "100vh",
                width: `calc(100vw - ${drawerWidth}px)`,
                overflow: "hidden",
            }}
        >
            {!isFullWidth && <Toolbar />} {/* Only show toolbar for non-full-width pages */}
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/segments" element={<Segments />} />
                <Route path="/retention" element={<Retention />} />
                <Route path="/funnel" element={<Funnel />} />
                <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
        </Box>
    );
}

export default function App() {
    return (
        <Router>
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <MainContent />
            </Box>
        </Router>
    );
}