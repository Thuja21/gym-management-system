import React, {useEffect, useState} from "react";
import Hero from "../../components/Member/Hero.jsx";
import Navbar from "../../components/Member/Navbar.jsx";
import Footer from "../../components/Member/Footer.jsx";
import TrainerCard from "../../components/Member/TrainerCard";
import {FaDumbbell, FaUsers, FaHeartbeat, FaAppleAlt, FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";
import FeatureCard from "../../components/Member/FeatureCard.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {

    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Fetch members from backend
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/trainers/all"); // Update with your backend URL
                if (!response.ok) {
                    throw new Error("Failed to fetch trainers.");
                }
                const data = await response.json();
                setTrainers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainers();
    }, [loading]);

    const features = [
        {
            icon: FaDumbbell,
            title: "Modern Equipment",
            description:
                "State-of-the-art fitness equipment for all your workout needs.",
        },
        {
            icon: FaUsers,
            title: "Expert Trainers",
            description:
                "Professional trainers to guide you through your fitness journey.",
        },
        {
            icon: FaHeartbeat,
            title: "Diverse Classes",
            description:
                "Wide range of classes to keep your workouts exciting and effective.",
        },
        {
            icon: FaAppleAlt,
            title: "Nutrition Plans",
            description:
                "Customized nutrition plans to complement your fitness goals.",
        },
    ];
    return (
        <div className="home-container" >
            <Navbar />
            <div className="content-wrapper">
                <Hero />

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

                {/* Features Section */}
                <section className="py-16 bg-light">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Why Choose JK Fitness
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We provide everything you need to achieve your fitness goals in
                                one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trainers Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Meet Our Trainers
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our certified trainers are here to guide and motivate you on your
                                fitness journey.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {trainers.map((trainer, index) => (
                                <TrainerCard
                                    key={trainer.trainer_id}
                                    // image={trainer.image}
                                    name={trainer.full_name}
                                    specialty={trainer.specialization}
                                    delay={index * 0.1}
                                />
                            ))}

                            <motion.div
                                className="bg-primary rounded-lg shadow-lg overflow-hidden flex flex-col justify-center items-center text-white p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
                                <p className="text-center mb-6">
                                    Are you a certified trainer looking to share your expertise?
                                    We're always looking for passionate fitness professionals to
                                    join our team.
                                </p>
                                <Link
                                    to="/contact"
                                    className="bg-white text-primary font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition duration-300"
                                >
                                    Join Now
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
};

export default Home;
