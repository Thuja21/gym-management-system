import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MembershipCard from "../../components/Member/MembershipCard.jsx";
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

const Membership = () => {

    const [plans, setPlans] = useState([]); // State to store membership types

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8800/api/plans/all");
                setPlans(response.data); // Store membership plans in the state
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div style={{width:'100vw'}}>
            <Navbar/>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0A0A0A] text-white" style={{ fontFamily: "Montserrat" }}>
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80')" }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-left">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Membership Plans</h1>
                        <p className="text-xl text-gray-300">Choose the perfect membership plan to achieve your fitness goals.</p>
                    </div>
                </div>
            </section>

            {/* Membership Plans */}
            <section className="py-16 bg-[#F8F8F8]" style={{ fontFamily: "Montserrat" }}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Plan</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">We offer flexible membership options to fit your lifestyle and budget.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                        {plans.map((plan, index) => (
                            <MembershipCard
                                key={index}
                                title={plan.plan_name}
                                price={plan.plan_price}
                                period={plan.plan_duration}
                                features={plan.features}
                                popular={!!plan.popular}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Process */}
            <section className="py-16 bg-light" style={{ fontFamily: "Montserrat" }}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Join</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Becoming a member is quick and easy. Follow these simple steps to
                            start your fitness journey with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3">Choose Your Plan</h3>
                            <p className="text-gray-600">
                                Select the membership plan that best fits your fitness goals and
                                budget. Not sure which one? Contact us for guidance.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3">Complete Registration</h3>
                            <p className="text-gray-600">
                                Fill out our membership form online or in person. You'll need a
                                valid ID and payment method to complete your registration.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3">Start Your Journey</h3>
                            <p className="text-gray-600">
                                Schedule your complimentary fitness assessment, get oriented
                                with our facilities, and begin your fitness journey with
                                JK Fitness.
                            </p>
                        </motion.div>
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/signup" className="btn-primary inline-block">
                            Join Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#0A0A0A] text-white" >
                <div className="container mx-auto px-4 md:px-6 text-center" >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6" >Ready to Start Your Fitness Journey?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">Join JK Fitness today and take the first step towards a healthier, stronger you.</p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link to="/contact" className="bg-white text-[#FF4500] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300">Join Now</Link>
                        {/*<Link to="/contact" className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-[#FF4500] transition duration-300">Schedule a Tour</Link>*/}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Membership;
