import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Member/Navbar.jsx";

const Hero = () => {
    return (
            <div className="relative flex h-screen items-center justify-center w-screen overflow-hidden" >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                >
                    {/* Black overlay */}
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center md:text-left md:ml-12 lg:ml-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl text-left lg:text-6xl font-extrabold text-white leading-tight mb-4 ml-24">
                            Transform Your Body, <br />
                            <span className="text-[#FF4500]">Transform Your Life</span>
                        </h1>

                        <p className="text-xl text-gray-200 mb-8 max-w-xl md-20 ml-24 text-left" style={{ fontFamily: 'Montserrat' }}>
                            Join JK Fitness today and start your journey to a
                            healthier, stronger, and more confident you.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start md:ml-24">
                            <Link
                                to="/membership"
                                className="bg-[#FF4500] text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-orange-600 transition duration-300"
                                style={{ fontFamily: 'Montserrat' }}
                            >
                                Join Now
                            </Link>
                            <Link
                                to="/classes"
                                className="bg-transparent border-2 border-white text-white font-bold py-2 px-6 rounded-lg hover:bg-white hover:text-black transition duration-300"
                            >
                                Explore Classes
                            </Link>
                        </div>

                    </motion.div>
                </div>
            </div>
    );
};

export default Hero;
