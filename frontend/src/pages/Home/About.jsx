import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaDumbbell,
    FaUsers,
    FaHeartbeat,
    FaAppleAlt,
    FaCheck,
} from "react-icons/fa";
import Navbar from "../../components/Member/Navbar.jsx";

const About = () => {

    return (
        <div>
            <Navbar />
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-dark text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            About JK Fitness
                        </h1>
                        <p className="text-xl text-gray-300">
                            Learn about our mission, values, and the story behind JK Fitness.
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-28 bg-white" style={{ fontFamily: "Montserrat"}}>
                <div className="container mx-auto px-4 md:px-6 text-justify ml-[-50px]" >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ml-[-10px] mr-[-130px]">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title" >About JK Fitness</h2>
                            <p className="text-gray-600 mb-6">
                                Founded in 2010, JK Fitness has been dedicated to helping people
                                transform their lives through fitness. Our state-of-the-art
                                facilities, expert trainers, and supportive community create the
                                perfect environment for you to achieve your health and fitness
                                goals.
                            </p>
                            <p className="text-gray-600 mb-6">
                                Whether you're a beginner or an experienced athlete, we have the
                                resources and expertise to help you reach new heights in your
                                fitness journey.
                            </p>
                            <Link to="/about" className="btn-primary inline-block">
                                Learn More About Us
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="rounded-lg overflow-hidden shadow-xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                alt="Gym Interior"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our Mission & Vision
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Guiding principles that drive everything we do at FitnessHub.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-primary">
                                Our Mission
                            </h3>
                            <p className="text-gray-600">
                                To empower individuals to transform their lives through fitness
                                by providing exceptional facilities, expert guidance, and a
                                supportive community. We are committed to making fitness
                                accessible, enjoyable, and effective for everyone, regardless of
                                their starting point.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-primary">
                                Our Vision
                            </h3>
                            <p className="text-gray-600">
                                To be the leading fitness center that inspires and enables
                                people to live healthier, happier lives. We envision a world
                                where fitness is an integral part of everyone's lifestyle,
                                contributing to overall well-being and longevity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title">Our Facilities</h2>
                            <p className="text-gray-600 mb-6">
                                At FitnessHub, we pride ourselves on offering top-of-the-line
                                facilities designed to enhance your workout experience. Our gym
                                is equipped with the latest fitness technology and amenities to
                                help you achieve your goals efficiently and comfortably.
                            </p>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>
                    State-of-the-art cardio and strength training equipment
                  </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>Dedicated functional training area</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>Spacious group fitness studios</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>Luxury locker rooms with showers and saunas</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>Nutrition bar and lounge area</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-primary mt-1 mr-2" />
                                    <span>Childcare services during peak hours</span>
                                </li>
                            </ul>

                            <Link to="/membership" className="btn-primary inline-block">
                                Explore Membership Options
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="Gym Equipment"
                                    className="rounded-lg shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="Gym Interior"
                                    className="rounded-lg shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                                    alt="Yoga Studio"
                                    className="rounded-lg shadow-md"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                                    alt="Locker Room"
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Experience FitnessHub?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join our community today and start your journey towards a healthier,
                        stronger you.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link
                            to="/membership"
                            className="bg-white text-primary font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            View Membership Options
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"
                        >
                            Schedule a Tour
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;







