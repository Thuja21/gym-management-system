import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#0A0A0A] text-white pt-12 pb-6" >
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
                    {/* About Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-white">JK </span>
                            <span className="text-[#FF4500]">Fitness</span>
                        </h3>
                        <p className="text-gray-300 mb-6 leading-relaxed " style={{ fontFamily: 'Montserrat' }} >
                            Transform your body and mind with our state-of-the-art facilities
                            and expert trainers. Join our community and achieve your fitness
                            goals.
                        </p>
                        <div className="flex space-x-4" >
                            <a href="#" className="text-gray-300 hover:text-[#FF4500] transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-[#FF4500] transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-[#FF4500] transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-[#FF4500] transition-colors">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1 ml-[60px]">
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2" style={{ fontFamily: 'Montserrat' }} >
                            <li><Link to="/" className="text-gray-300 hover:text-[#FF4500] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-[#FF4500] transition-colors">About Us</Link></li>
                            <li><Link to="/classes" className="text-gray-300 hover:text-[#FF4500] transition-colors">Classes</Link></li>
                            <li><Link to="/trainers" className="text-gray-300 hover:text-[#FF4500] transition-colors">Trainers</Link></li>
                            <li><Link to="/membership" className="text-gray-300 hover:text-[#FF4500] transition-colors">Membership</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-[#FF4500] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div className="lg:col-span-1 ml-[-20px]">
                        <h3 className="text-xl font-bold mb-4">Working Hours</h3>
                        <ul className="space-y-2 " style={{ fontFamily: 'Montserrat' }} >
                            <li className="flex justify-between"><span className="text-gray-300">Monday - Friday:</span> <span className="text-[#FF4500] mr-[-40px] ">5:00 AM - 10:00 PM</span></li>
                            <li className="flex justify-between"><span className="text-gray-300">Saturday:</span> <span className="text-[#FF4500] ml-[25px]  mr-[-35px]">6:00 AM - 8:00 PM</span></li>
                            <li className="flex justify-between"><span className="text-gray-300">Sunday:</span> <span className="text-[#FF4500] ml-[47px] mr-[-35px]">8:00 AM - 6:00 PM</span></li>
                            <li className="flex justify-between"><span className="text-gray-300">Holidays:</span> <span className="text-[#FF4500] ml-[40px] mr-[-35px]">8:00 AM - 2:00 PM</span></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-1  ml-[100px] mr-[-50px]">
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-4" style={{ fontFamily: 'Montserrat' }} >
                            <li className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-[#FF4500] mt-1" />
                                <span className="text-gray-300">123 Point Pedro, Jaffna </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhone className="text-[#FF4500]" />
                                <span className="text-gray-300">(123) 456-7890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="text-[#FF4500]" />
                                <span className="text-gray-300">info@JK-fitness.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; 2025 JK-Fitness. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;