import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Search as SearchIcon, AccountCircle } from "@mui/icons-material";
import Logo from "../assets/images/logo.png";
import "../pages/Admin/Admin.css";

const TopBar = ({ userName, title, onSearch }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#1a1b23",
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

                <Typography variant="h6" component="div" sx={{ color: "#ffffff", marginTop: "10px" }}>
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

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" component="div" sx={{ color: "#ffffff", marginRight: "16px" }}>
                        {userName}
                    </Typography>

                    <IconButton onClick={handleClick} sx={{ color: "#ffffff" }}>
                        <Avatar sx={{ bgcolor: "#f50057" }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Settings</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
