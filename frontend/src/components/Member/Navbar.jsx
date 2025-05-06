import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { FaUserCircle, FaBell } from "react-icons/fa"; // Import profile icon

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const [userType, setUserType] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [activeLink, setActiveLink] = useState(location.pathname); // Track active link
    const navigate = useNavigate(); // Initialize navigate hook
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const alwaysDarkBackground = [
        '/paymentHistory',
        '/attendanceHistory',
        '/notification',
        '/memberProfile',
        '/changePlan',
        '/checkout',
    ];

    const isSolidBackground = scrolled || alwaysDarkBackground.includes(location.pathname);



    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check login status dynamically
    useEffect(() => {
        const checkUser = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.user_type === "MEMBER") {
                setUserType("MEMBER");
            } else {
                setUserType(null);
            }
        };
        checkUser(); // Run on mount

        // Listen for storage changes (for real-time login/logout updates)
        window.addEventListener("storage", checkUser);
        return () => window.removeEventListener("storage", checkUser);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user data
        localStorage.removeItem("userType"); // Remove userType
        setUserType(null); // Update state
        navigate("/login"); // Redirect to login page
    };

    const navLinks = [
        { name: "Home", path: "/home" },
        // { name: "About", path: "/about" },
        { name: "Classes", path: "/classes" },
        // { name: "Trainers", path: "/trainers" },
        { name: "Membership", path: "/membership" },
        // ...(userType !== "MEMBER" ? [{ name: "Membership", path: "/membership" }] : []),
        { name: "Supplements", path: "/supplements" },
        { name: "Contact", path: "/contact" },
    ];


    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp);
        const secondsAgo = Math.floor((now - createdAt) / 1000);

        if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) return `${hoursAgo} hours ago`;
        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 7) return `${daysAgo} days ago`;
        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo < 4) return `${weeksAgo} weeks ago`;
        const monthsAgo = Math.floor(daysAgo / 30);
        if (monthsAgo < 12) return `${monthsAgo} months ago`;
        const yearsAgo = Math.floor(daysAgo / 365);
        return `${yearsAgo} years ago`;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (userType === "MEMBER") {
                    const res = await fetch("http://localhost:8800/api/announcements/all"); // Update with your backend URL
                    let data = await res.json();

                    // Convert timestamp to "time ago" format
                    data = data.map((notif) => ({
                        ...notif,
                        timeAgo: getTimeAgo(notif.created_at),
                    }));

                    setNotifications(data);
                }
            } catch (err) {
                setError("Failed to load notifications.");
            }
        };
        fetchNotifications();
    }, [userType]);

    return (
        // <nav
        //     className={`fixed w-full z-50 transition-all duration-300 ${
        //         scrolled ? "bg-[#0A0A0A] py-2 shadow-lg " : "bg-transparent py-4"
        //     }`}
        // >
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isSolidBackground ? "bg-[#0A0A0A] py-2 shadow-lg" : "bg-transparent py-4"
            }`}
        >

        <div className="container mx-auto px-4 md:px-6  ">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center text-2xl font-bold text-white">
                        <img src={Logo}  // Replace with your actual logo path
                             alt="JK Fitness Logo"
                             className="h-9 w-auto mr-2" // Added margin-right for spacing between the logo and text
                        />
                        <span>JK<span className="text-[#FF4500]"> FITNESS</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-8" style={{ fontFamily: 'Montserrat' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-white hover:text-[#FF4500] transition-colors ${
                                    activeLink === link.path
                                        ? "font-semibold border-b-2 border-[#FF4500]"
                                        : ""
                                }`}
                                onClick={() => setActiveLink(link.path)} // Set active link on click
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Notification Icon with Active State */}
                        {userType === "MEMBER" && (
                            <div className="relative">
                                <button
                                    className="text-white relative hover:text-[#FF4500] transition-colors"
                                    onClick={() => {setShowNotifications(!showNotifications);
                                        setActiveLink("/notifications"); // Set active link on notification click
                                        // navigate("/notification"); // Navigate to notifications page
                                    }}
                                >
                                    <FaBell
                                        className={`text-xl mt-[5px] ${
                                            showNotifications ? "text-[#FF4500]" : "text-white"
                                        }`}
                                    />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-[-3px] -right--[-1px] bg-red-500 text-white text-xs font-bold px-1 py-0.2 rounded-full">
                    {notifications.length}
                </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white text-black rounded-lg shadow-lg overflow-hidden border border-gray-300">
                                        <div className="px-4 py-2 font-semibold border-b border-gray-300 flex justify-between items-center">
                                            <span>Notifications</span>
                                            <span className="text-blue-500 cursor-pointer text-sm"></span> {/* Settings Icon */}
                                        </div>
                                        {notifications.length > 0 ? (
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications
                                                    .slice() // Create a copy of the notifications array
                                                    .reverse() // Reverse the order to show newest first
                                                    .map((notif) => (
                                                        <div key={notif.announcement_id} className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100">
                                                            <div className="flex items-start">
                                                                <span className="mr-2">🖊️</span> {/* Pencil Icon */}
                                                                <div className="w-full">
                                                                    <div className="font-medium">{notif.announcement_title}</div>
                                                                    {/* Flexbox for timeAgo & "View full notification" */}
                                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                                                        <span>{notif.timeAgo}</span>
                                                                        <span className="text-blue-500 cursor-pointer text-sm"
                                                                              onClick={() => navigate(`/notification/${notif.announcement_id}`)}>
                                                    View full notification
                                                </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-4 text-sm text-gray-500">No new notifications</div>
                                        )}
                                        <div className="px-4 py-3 text-center text-blue-500 cursor-pointer border-t border-gray-300"
                                             onClick={() => navigate("/notification")} >
                                            See all
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Profile Dropdown */}
                        {userType === "MEMBER" ? (
                            <div className="relative">
                                <button
                                    className="flex items-center text-white space-x-2 hover:text-[#FF4500] transition-colors"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <FaUserCircle className={`text-[22px] mt-[1px] ${showDropdown ? "text-[#FF4500]" : "text-white"}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-3 w-[200px] bg-white rounded-lg shadow-lg border border-gray-300">

                                        {/* Curved Arrow */}
                                        <div className="absolute -top-[6px] right-1 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-300"></div>

                                        {/* Profile Options */}
                                        <div className="py-2 text-left">
                                            <Link to="/memberProfile" className="block px-4 py-3 text-gray-800 text-sm hover:bg-gray-100 transition">
                                                Profile
                                            </Link>
                                            <Link to="/changePlan" className="block px-4 py-3 text-gray-800 text-sm hover:bg-gray-100 transition">
                                                Plan
                                            </Link>
                                            <Link to="/attendanceHistory" className="block px-4 py-3 text-gray-800 text-sm hover:bg-gray-100 transition">
                                                Attendance History
                                            </Link>
                                            <Link to="/paymentHistory" className="block px-4 py-3 text-gray-800 text-sm hover:bg-gray-100 transition">
                                                Payment History
                                            </Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-600 text-sm hover:bg-red-100 transition">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-[#E64100] text-white px-3 py-2 rounded-md text-sm font-semibold transition duration-300 hover:bg-[#6e0404]"
                                style={{ fontFamily: "Montserrat" }}
                            >
                                Login
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
