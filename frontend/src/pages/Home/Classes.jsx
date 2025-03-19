import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Classes = () => {
    const [filter, setFilter] = useState("all");

    const classCategories = [
        { id: "all", name: "All Classes" },
        { id: "cardio", name: "Cardio" },
        { id: "strength", name: "Strength" },
        { id: "mind-body", name: "Mind & Body" },
        { id: "hiit", name: "HIIT" },
    ];

    const classes = [
        {
            id: 1,
            title: "HIIT Training",
            category: "hiit",
            image:
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Alex Johnson",
            schedule: "Mon, Wed, Fri - 6:00 AM, 5:30 PM",
            duration: "45 minutes",
            level: "Intermediate",
            description:
                "High-intensity interval training to maximize calorie burn and improve cardiovascular health. This class alternates between intense bursts of activity and fixed periods of less-intense activity or rest.",
        },
        {
            id: 2,
            title: "Strength Training",
            category: "strength",
            image:
                "https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Mike Williams",
            schedule: "Tue, Thu, Sat - 7:00 AM, 6:30 PM",
            duration: "60 minutes",
            level: "All Levels",
            description:
                "Build muscle, increase strength, and improve overall body composition. This class focuses on resistance training using free weights, machines, and bodyweight exercises.",
        },
        {
            id: 3,
            title: "Yoga Flow",
            category: "mind-body",
            image:
                "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Sarah Chen",
            schedule: "Daily - 8:00 AM, 7:00 PM",
            duration: "75 minutes",
            level: "All Levels",
            description:
                "Improve flexibility, balance, and mental clarity through guided yoga sessions. This class synchronizes movement with breath for a dynamic and flowing practice.",
        },
        {
            id: 4,
            title: "Spin Class",
            category: "cardio",
            image:
                "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "David Kim",
            schedule: "Mon, Wed, Fri - 7:00 AM, 6:00 PM",
            duration: "45 minutes",
            level: "All Levels",
            description:
                "High-energy indoor cycling workout that simulates outdoor riding with varying speeds and resistance levels. Great for cardiovascular health and lower body strength.",
        },
        {
            id: 5,
            title: "Pilates",
            category: "mind-body",
            image:
                "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Emma Thompson",
            schedule: "Tue, Thu - 9:00 AM, 5:00 PM",
            duration: "60 minutes",
            level: "All Levels",
            description:
                "Focus on core strength, flexibility, and body awareness. Pilates helps develop balanced, lean muscles and improves posture and alignment.",
        },
        {
            id: 6,
            title: "Bootcamp",
            category: "hiit",
            image:
                "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
            trainer: "James Wilson",
            schedule: "Mon, Wed, Fri - 5:30 AM, 6:30 PM",
            duration: "60 minutes",
            level: "Intermediate to Advanced",
            description:
                "Military-inspired workout that combines strength training and intense cardio. This high-energy class will challenge you physically and mentally.",
        },
        {
            id: 7,
            title: "Zumba",
            category: "cardio",
            image:
                "https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Maria Garcia",
            schedule: "Tue, Thu, Sat - 10:00 AM, 5:00 PM",
            duration: "60 minutes",
            level: "All Levels",
            description:
                "Dance-based fitness class featuring Latin and international music. A fun way to get a total body workout while enjoying energetic music.",
        },
        {
            id: 8,
            title: "Powerlifting",
            category: "strength",
            image:
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            trainer: "Chris Johnson",
            schedule: "Mon, Wed, Fri - 6:00 PM",
            duration: "75 minutes",
            level: "Intermediate to Advanced",
            description:
                "Focus on the three main powerlifting movements: squat, bench press, and deadlift. This class helps build maximum strength and power.",
        },
    ];

    const filteredClasses =
        filter === "all"
            ? classes
            : classes.filter((cls) => cls.category === filter);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-dark text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Classes</h1>
                        <p className="text-xl text-gray-300">
                            Discover our wide range of fitness classes designed to help you
                            achieve your goals.
                        </p>
                    </div>
                </div>
            </section>

            {/* Classes Filter */}
            <section className="py-8 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap justify-center gap-4">
                        {classCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setFilter(category.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                    filter === category.id
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Classes Grid */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClasses.map((cls, index) => (
                            <motion.div
                                key={cls.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src={cls.image}
                                    alt={cls.title}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold">{cls.title}</h3>
                                        <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {cls.level}
                    </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3">
                                        Instructor: {cls.trainer}
                                    </p>
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <span className="font-semibold mr-2">Schedule:</span>
                                            <span className="text-gray-600">{cls.schedule}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Duration:</span>
                                            <span className="text-gray-600">{cls.duration}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{cls.description}</p>
                                    <button
                                        className="text-primary font-semibold hover:underline inline-flex items-center"
                                        onClick={() =>
                                            window.scrollTo({
                                                top:
                                                    document.getElementById("schedule").offsetTop - 100,
                                                behavior: "smooth",
                                            })
                                        }
                                    >
                                        View in Schedule
                                        <svg
                                            className="w-4 h-4 ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Class Schedule */}
            <section id="schedule" className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Weekly Class Schedule
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Plan your week with our comprehensive class schedule. All classes
                            are included with your membership.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                            <tr>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Time
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Monday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Tuesday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Wednesday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Thursday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Friday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Saturday
                                </th>
                                <th className="py-3 px-4 bg-gray-100 font-semibold text-gray-700 border-b border-gray-200">
                                    Sunday
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    6:00 AM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    7:00 AM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Strength Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Spin Class
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Strength Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Spin Class
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Strength Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    8:00 AM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    9:00 AM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Pilates
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Pilates
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    10:00 AM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Zumba
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Zumba
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Zumba
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    5:00 PM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Pilates
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Pilates
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Zumba
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    5:30 PM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    HIIT Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    6:00 PM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Powerlifting
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Powerlifting
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Powerlifting
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    6:30 PM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Bootcamp
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Strength Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Bootcamp
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Strength Training
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Bootcamp
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                                <td className="py-3 px-4 border-b border-gray-200">-</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                                    7:00 PM
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 bg-primary bg-opacity-10">
                                    Yoga Flow
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Class Policies */}
            <section className="py-16 bg-light">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Class Policies</h2>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-bold mb-3">Reservations</h3>
                            <p className="text-gray-600 mb-4">
                                Members can reserve a spot in any class up to 7 days in advance
                                through our mobile app or website. We recommend booking early as
                                classes fill up quickly.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-bold mb-3">Cancellations</h3>
                            <p className="text-gray-600 mb-4">
                                If you need to cancel your reservation, please do so at least 2
                                hours before the class starts to avoid a late cancellation fee.
                                This allows other members to take your spot.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-bold mb-3">What to Bring</h3>
                            <p className="text-gray-600 mb-4">
                                Please bring a water bottle, towel, and appropriate workout
                                attire. For yoga and pilates classes, mats are provided, but
                                you're welcome to bring your own.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold mb-3">Late Arrivals</h3>
                            <p className="text-gray-600 mb-4">
                                For your safety and to minimize disruption, members who arrive
                                more than 10 minutes late may not be permitted to join the
                                class. Please arrive at least 5 minutes early to set up.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Join a Class?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Experience the energy and motivation of group fitness. Your first
                        class is on us!
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link
                            to="/membership"
                            className="bg-white text-primary font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Become a Member
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"
                        >
                            Try a Free Class
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Classes;
