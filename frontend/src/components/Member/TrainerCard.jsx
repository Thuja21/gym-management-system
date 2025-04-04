import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const TrainerCard = ({ image, name, specialty, bio, delay = 0 }) => {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
        >
            <img src={image} alt={name} className="w-full h-72 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="text-primary font-medium mb-3">{specialty}</p>
                <p className="text-gray-600 mb-4">{bio}</p>
                <div className="flex space-x-3">
                    <a
                        href="#"
                        className="text-gray-500 hover:text-primary transition-colors"
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
    );
};

export default TrainerCard;
