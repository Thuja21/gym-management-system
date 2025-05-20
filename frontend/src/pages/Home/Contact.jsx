import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import Navbar from "../../components/Member/Navbar.jsx";


const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send the form data to a server here
        // For this demo, we'll simulate a successful submission
        setFormStatus({
            submitted: true,
            success: true,
            message: "Thank you for your message! We will get back to you soon.",
        });

        // Reset form after submission
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div style={{width: "100vw"}}>
            <Navbar/>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-dark text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-left" >
                    <div className="max-w-3xl" >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-300">
                            We're here to answer your questions and help you on your fitness
                            journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] bg-opacity-10 p-4 rounded-full mb-4">
                                <FaMapMarkerAlt className="text-[#FF4500] text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Location</h3>
                            <p className="text-gray-600">
                                Main St, sarayadi 40000
                                <br />
                                Point Pedro
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] bg-opacity-10 p-4 rounded-full mb-4">
                                <FaPhone className="text-[#FF4500] text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Phone Number</h3>
                            <p className="text-gray-600">
                                Main: 077 529 8455
                                <br />
                                Support: 077 539 6467
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] bg-opacity-10 p-4 rounded-full mb-4">
                                <FaEnvelope className="text-[#FF4500] text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Address</h3>
                            <p className="text-gray-600">
                                General: jkfitnessppt@gmail.com
                                <br />
                                Support: help@jkfitness.com
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#FF4500] bg-opacity-10 p-4 rounded-full mb-4">
                                <FaClock className="text-[#FF4500] text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Working Hours</h3>
                            <p className="text-gray-600">
                                Monday - Friday: 5:00 AM - 10:00 PM
                                <br />
                                Saturday: 6:00 AM - 8:00 PM
                                <br />
                                Sunday: 8:00 AM - 6:00 PM
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Form and Map */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title mb-8">Get in Touch</h2>

                            {formStatus.submitted && (
                                <div
                                    className={`p-4 mb-6 rounded-lg ${
                                        formStatus.success
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {formStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Your Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="membership">Membership Inquiry</option>
                                            <option value="classes">Class Information</option>
                                            <option value="personal-training">
                                                Personal Training
                                            </option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-primary">
                                    Send Message
                                </button>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="rounded-lg overflow-hidden shadow-xl h-[500px]"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3931.448178422435!2d80.2284661!3d9.8126733!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3aff030868e6a757%3A0xdf52b7a81d77b835!2sJK%20fitness%201.0!5e0!3m2!1sen!2slk!4v1743792137005!5m2!1sen!2slk"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="JK FitnessLocation"
                            ></iframe>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#0A0A0A] text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Fitness Journey?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Visit us today or schedule a tour to see our facilities and learn
                        more about our services.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <a
                            href="tel:+11234567890"
                            className="bg-white text-[#FF4500] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Call Us Now
                        </a>
                        <a
                            href="mailto:info@fitnesshub.com"
                            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
