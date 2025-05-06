import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const ChangePlanCard = ({
                            title,
                            price,
                            period,
                            plan_id,
                            features,
                            isCurrentPlan = false,
                            delay = 0,
                            shadow = true
                        }) => {

    const navigate = useNavigate();

    const handleSwitchPlan = () => {
        if (!isCurrentPlan) {
            navigate("/checkout", {
                state: {
                    plan: {
                        title,
                        price,
                        period,
                        plan_id,
                        features
                    }
                }
            });
        }
    };

    return (
        <motion.div
            className={`rounded-lg overflow-hidden ${isCurrentPlan ? "border-2 border-orange-400" : "border border-gray-200"}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
        >
            <div
                className={`${
                    isCurrentPlan ? "bg-[#FF4500] text-white" : "bg-white"
                } text-center py-2 font-semibold`}
            >
                {isCurrentPlan ? "Current Plan" : ""}
            </div>
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
                <button
                    onClick={handleSwitchPlan}
                    disabled={isCurrentPlan}
                    className={`block w-full text-center py-3 px-6 rounded-md font-semibold transition duration-300 ${
                        isCurrentPlan
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#FF4500] text-white hover:bg-opacity-90"
                    }`}
                >
                    {isCurrentPlan ? "Current Plan" : "Switch Plan"}
                </button>
            </div>
        </motion.div>
    );
};

export default ChangePlanCard;
