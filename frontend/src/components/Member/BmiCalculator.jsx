import React, { useState } from "react";
import { motion } from "framer-motion";

const BMICalculator = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [bmiClass, setBmiClass] = useState("");

    const calculateBmi = (e) => {
        e.preventDefault();
        if (height && weight) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(bmiValue);

            if (bmiValue < 18.5) {
                setBmiClass("Underweight");
            } else if (bmiValue >= 18.5 && bmiValue < 25) {
                setBmiClass("Normal weight");
            } else if (bmiValue >= 25 && bmiValue < 30) {
                setBmiClass("Overweight");
            } else {
                setBmiClass("Obesity");
            }
        }
    };

    return (
        <section className="py-16 bg-gray-200 text-gray-800">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Calculate Your <span className="text-[#FF4500]">BMI</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                        Body Mass Index helps you understand if you're at a healthy weight
                    </p>

                    <div className="max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={calculateBmi} className="space-y-6">
                                <div className="mb-6">
                                    <label htmlFor="height" className="block text-gray-700 mb-2 text-left font-medium">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        id="height"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="Enter your height"
                                        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="weight" className="block text-gray-700 mb-2 text-left font-medium">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="Enter your weight"
                                        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#FF4500] hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    Calculate BMI
                                </button>
                            </form>

                            {bmi && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-8 p-6 bg-white border border-gray-200 rounded-lg text-center shadow-md"
                                >
                                    <div className="mb-4">
                                        <span className="text-gray-500 text-sm">Your BMI</span>
                                        <div className="text-4xl font-bold text-gray-800">{bmi}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Category</span>
                                        <div className={`text-xl font-semibold ${
                                            bmiClass === "Underweight" ? "text-blue-500" :
                                                bmiClass === "Normal weight" ? "text-green-500" :
                                                    bmiClass === "Overweight" ? "text-yellow-500" :
                                                        "text-red-500"
                                        }`}>
                                            {bmiClass}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BMICalculator;
