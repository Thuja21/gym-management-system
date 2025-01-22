import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Logo from "../assets/images/logo.png";

const TopBar = ({ userName, logo, onSearch }) => {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#000000", // Background color for the top bar
                boxShadow: "none", // Remove default shadow
                padding: "0 16px",
                margin: "-60px -20px",
                width: "100vw",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* Logo Section */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={Logo} alt="Logo" style={{ height: "40px", marginRight: "15px", marginLeft: "-13px" }} />
                    <Typography variant="h6" component="div">
                        Dashboard
                    </Typography>
                </Box>

                {/* Search Section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#353545",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        width: "40%",
                    }}
                >
                    <IconButton>
                        <SearchIcon sx={{ color: "#ffffff" }} />
                    </IconButton>
                    <InputBase
                        placeholder="Search…"
                        sx={{
                            marginLeft: "8px",
                            color: "#ffffff",
                            flex: 1,
                            fontSize: "14px",
                        }}
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </Box>

                {/* User Section */}
                <Typography variant="subtitle1" component="div" sx={{ color: "#ffffff" }}>
                    {userName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
