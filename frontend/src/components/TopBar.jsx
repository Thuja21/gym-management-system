import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Logo from "../assets/images/logo.png";
import "../pages/Admin/Admin.css";

const TopBar = ({ userName, title, onSearch }) => {
    return (

        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#000000",
                boxShadow: "none",
                padding: "0 16px",
            }}

        >

            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={Logo} alt="Logo" style={{ height: "40px", marginRight: "15px" }} />
                </Box>

                {/* Dynamically Updated Title */}
                <Typography variant="h6" component="div" sx={{ color: "#ffffff" , marginTop: "10px" }}>
                    {title}
                </Typography>

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

                <Typography variant="subtitle1" component="div" sx={{ color: "#ffffff" }}>
                    {userName}
                </Typography>
                <Box className="divider-bar2" />
            </Toolbar>

        </AppBar>




    );
};

export default TopBar;
