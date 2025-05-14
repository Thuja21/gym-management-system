import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Search as SearchIcon, AccountCircle } from "@mui/icons-material";
import Logo from "../assets/images/logo.png";
import "../pages/Admin/Admin.css";
import { useNavigate } from "react-router-dom";


const TopBar = ({ userName, title, onSearch, setCurrentTitle }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleClose();
        // Update the title when navigating to profile
        if (setCurrentTitle) {
            setCurrentTitle("Profile");
        }
        navigate("/trainerProfile");
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

                <Box sx={{ display: "flex", alignItems: "center" , marginRight: "-15px"}}>
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
                        PaperProps={{
                            elevation: 4,
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: 2,
                                border: '1px solid #d1d5db', // Tailwind: border-gray-300
                                backgroundColor: '#ffffff',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                overflow: 'visible',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 14,
                                    height: 14,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                    borderTop: '1px solid #d1d5db',
                                    borderLeft: '1px solid #d1d5db',
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={handleProfileClick}>
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate("/login"); // or "/" if that's your logout landing
                            }}
                        >
                            Logout
                        </MenuItem>

                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
