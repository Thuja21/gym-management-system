import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import {Check} from "lucide-react";

const MembershipCard = ({
                            title,
                            price,
                            period,
                            features,
                            popular = true,
                            delay = 0,
                        }) => {
    return (
        <motion.div
            className={`rounded-lg shadow-lg overflow-hidden ${
                popular ? "border-2 border-[#FF4500]" : "border border-gray-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
        >
            {popular && (
                <div className="bg-[#FF4500] text-white text-center py-2 font-semibold">
                    Most Popular
                </div>
            )}
            <div className="bg-white p-6">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <div className="mb-4">
                    <span className="text-4xl font-bold">Rs.{price}</span>
                    <span className="text-gray-500">/{period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                    {(features || "").split(", ").map((feature, i) => (
                        <li key={i} className="flex items-center">
                            <FaCheck className="text-[#FF4500] mr-2" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <Link
                    to="/contact"
                    className={`block text-center py-3 px-6 rounded-md font-semibold transition duration-300 ${
                        popular
                            ? "bg-[#FF4500] text-white hover:bg-opacity-90"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                    Choose Plan
                </Link>
            </div>
        </motion.div>
    );
};

export default MembershipCard;
