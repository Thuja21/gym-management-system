import React, {useState} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Navbar from "../../components/Member/Navbar.jsx";

const Trainers = () => {

    const trainers = [
        {
            id: 1,
            name: "Alex Johnson",
            image:
                "https://images.unsplash.com/photo-1597347343908-2937e7dcc560?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            specialty: "HIIT Specialist",
            experience: "10+ years",
            certifications: [
                "NASM Certified Personal Trainer",
                "HIIT Training Specialist",
                "Nutrition Coach",
            ],
            // bio: "Alex has been transforming lives through fitness for over a decade. With a background in competitive sports and specialized training in high-intensity workouts, Alex helps clients push their limits and achieve remarkable results. Known for challenging yet effective sessions that keep clients coming back for more.",
        },
        {
            id: 2,
            name: "Sarah Chen",
            image:
                "https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            specialty: "Yoga Instructor",
            experience: "8 years",
            certifications: [
                "RYT-500 Certified",
                "Meditation Coach",
                "Prenatal Yoga Specialist",
            ],
            // bio: "Sarah discovered yoga during a stressful period in her corporate career and it transformed her life. She left the corporate world to pursue her passion for helping others find balance through yoga. Her classes focus on mindful movement, proper alignment, and connecting breath with movement for a holistic practice.",
        },
        {
            id: 3,
            name: "Mike Williams",
            image:
                "https://images.unsplash.com/photo-1583468982228-19f19164aee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            specialty: "Strength Coach",
            experience: "12 years",
            certifications: [
                "NSCA Certified Strength and Conditioning Specialist",
                "USA Weightlifting Coach",
                "Functional Movement Specialist",
            ],
            // bio: "Mike specializes in helping clients build strength, improve performance, and transform their physiques. With a background in competitive powerlifting and a deep understanding of biomechanics, he creates personalized programs that deliver results while minimizing injury risk. His approach combines traditional strength training with modern functional movement principles.",
        },
        {
            id: 4,
            name: "Emma Thompson",
            image:
                "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            specialty: "Pilates Instructor",
            experience: "7 years",
            certifications: [
                "Comprehensive Pilates Certification",
                "Rehabilitation Specialist",
                "Pre/Post Natal Pilates",
            ],
            // bio: "Emma's journey with Pilates began after a dance injury led her to discover its rehabilitative benefits. Now, she's passionate about helping clients improve core strength, flexibility, and posture through precise, controlled movements. Her sessions emphasize proper technique and mind-body connection for maximum benefit.",
        },
        {
            id: 5,
            name: "David Kim",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            specialty: "Cycling Coach",
            experience: "9 years",
            certifications: [
                "Certified Spinning Instructor",
                "Indoor Cycling Specialist",
                "Sports Nutrition Advisor",
            ],
            // bio: "David brings energy and enthusiasm to every cycling class. A former competitive cyclist, he combines technical expertise with motivational coaching to help riders of all levels improve their performance. His classes feature carefully curated playlists and challenging interval training to maximize cardiovascular benefits.",
        },
        {
            id: 6,
            name: "Maria Garcia",
            image:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
            specialty: "Dance Fitness Instructor",
            experience: "6 years",
            certifications: [
                "Zumba Certified Instructor",
                "Dance Fitness Specialist",
                "Group Exercise Instructor",
            ],
            // bio: "Maria brings the joy of dance to fitness. With a background in professional dance and a passion for helping people enjoy their workouts, her classes are known for being fun, energetic, and effective. She specializes in making dance accessible to everyone, regardless of previous experience.",
        },
    ];

    return (
        <div style={{width: "100vw"}}>
            <Navbar/>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0A0A0A] text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-left" style={{ fontFamily: "Montserrat"}}>
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Expert Trainers
                        </h1>
                        <p className="text-xl text-gray-300">
                            Meet the dedicated professionals who will guide you on your
                            fitness journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Trainers Grid */}
            <section className="py-16 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {trainers.map((trainer, index) => (
                            <motion.div
                                key={trainer.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="w-full h-50 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                                    <p className="text-[#FF4500] font-medium mb-2">
                                        {trainer.specialty}
                                    </p>
                                    <p className="text-gray-600 mb-4">{trainer.bio}</p>

                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Certifications:</h4>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {trainer.certifications.map((cert, i) => (
                                                <li key={i}>{cert}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex space-x-3">
                                        <a
                                            href="#"
                                            className="text-gray-500 hover:text-[#FF4500] transition-colors"
                                        >
                                            <FaFacebook size={18} />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-500 hover:text-primary transition-colors"
                                        >
                                            <FaInstagram size={18} />
                                        </a>
                                        <a
                                            href="#"
                                            className="text-gray-500 hover:text-primary transition-colors"
                                        >
                                            <FaTwitter size={18} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Our Trainers Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title">Why Choose Our Trainers</h2>
                            <p className="text-gray-600 mb-6">
                                At FitnessHub, we pride ourselves on having the most qualified,
                                passionate, and dedicated fitness professionals in the industry.
                                Our trainers are not just certified experts; they're motivators,
                                educators, and partners in your fitness journey.
                            </p>

                            <div className="space-y-4 mb-6">
                                <div className="bg-light p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Certified Professionals</h3>
                                    <p className="text-gray-600">
                                        All our trainers hold multiple certifications from
                                        nationally recognized organizations and continuously update
                                        their knowledge.
                                    </p>
                                </div>

                                <div className="bg-light p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Personalized Approach</h3>
                                    <p className="text-gray-600">
                                        We understand that every client is unique. Our trainers
                                        create customized programs tailored to your specific goals
                                        and needs.
                                    </p>
                                </div>

                                <div className="bg-light p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Continuous Support</h3>
                                    <p className="text-gray-600">
                                        Beyond your sessions, our trainers provide guidance on
                                        nutrition, recovery, and lifestyle changes to maximize your
                                        results.
                                    </p>
                                </div>
                            </div>

                            <Link to="/contact" className="btn-primary inline-block">
                                Book a Session
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
                                src="https://images.unsplash.com/photo-1571388208497-71bedc66e932?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
                                alt="Personal Training Session"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Training Options */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Training Options
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose the training experience that best fits your needs and
                            goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3">Personal Training</h3>
                                <p className="text-gray-600 mb-4">
                                    One-on-one sessions tailored specifically to your goals,
                                    fitness level, and preferences. Our most personalized option
                                    for maximum results.
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Customized workout plans</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Nutrition guidance</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Progress tracking</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Flexible scheduling</span>
                                    </li>
                                </ul>
                                <Link
                                    to="/contact"
                                    className="block text-center bg-[#FF4500] text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300"
                                >
                                    Inquire Now
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#FF4500]"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] text-white text-center py-2 font-semibold">
                                Most Popular
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3">Partner Training</h3>
                                <p className="text-gray-600 mb-4">
                                    Train with a friend or partner for added motivation and shared
                                    cost. Enjoy the benefits of personalized training with someone
                                    you know.
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Shared motivation</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Cost-effective</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Customized for two</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Fun, competitive element</span>
                                    </li>
                                </ul>
                                <Link
                                    to="/contact"
                                    className="block text-center bg-[#FF4500] text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300"
                                >
                                    Inquire Now
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3">Small Group Training</h3>
                                <p className="text-gray-600 mb-4">
                                    Train in a small group of 3-6 people with similar goals. Enjoy
                                    the energy of group training with personalized attention.
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Community support</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Most affordable option</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Scheduled sessions</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-p[#FF4500] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span>Varied workout styles</span>
                                    </li>
                                </ul>
                                <Link
                                    to="/contact"
                                    className="block text-center bg-[#FF4500] text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300"
                                >
                                    Inquire Now
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#0A0A0A] text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Work with Our Expert Trainers?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Take the first step towards achieving your fitness goals with
                        personalized guidance from our professional team.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link
                            to="/membership"
                            className="bg-white text-[#FF4500] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            View Membership Options
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"
                        >
                            Schedule a Consultation
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Trainers;
