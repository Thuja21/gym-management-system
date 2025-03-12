import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

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

    const navLinks = [
        { name: "Home", path: "/" },
        // { name: "About", path: "/about" },
        { name: "Classes", path: "/classes" },
        { name: "Trainers", path: "/trainers" },
        { name: "Membership", path: "/membership" },
        { name: "Supplements", path: "/supplements" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled ? "bg-[#0A0A0A] py-2 shadow-lg " : "bg-transparent py-4"
            }`}
        >
            <div className="container mx-auto px-4 md:px-6  ">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center text-2xl font-bold text-white">
                        <img
                            src={Logo}  // Replace with your actual logo path
                            alt="JK Fitness Logo"
                            className="h-9 w-auto mr-2" // Added margin-right for spacing between the logo and text

                        />
                        <span>
                        JK<span className="text-[#FF4500]"> FITNESS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-8" style={{ fontFamily: 'Montserrat' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-white hover:text-[#FF4500] transition-colors ${
                                    location.pathname === link.path
                                        ? "font-semibold border-b-2 border-[#FF4500]"
                                        : ""
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Login Button */}
                        <Link
                            to="/login"
                            className="bg-[#E64100] text-white px-3 py-1 rounded-md text-base font-semibold transition duration-300 hover:bg-[#6e0404] cursor-pointer" style={{ fontFamily: 'Montserrat' }}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
