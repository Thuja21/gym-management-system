import React, {useEffect} from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Member/Navbar.jsx";
import axios from "axios";

const Classes = () => {
    const [filter, setFilter] = useState("all");
    const [scheduleData, setScheduleData] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8800/api/schedules/all") // adjust URL to your backend
            .then((res) => {
                const enrichedData = res.data.map(item => {
                    const date = new Date(item.schedule_date);
                    const options = { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true };
                    const formatted = date.toLocaleString('en-US', options);
                    return { ...item,
                        schedule_date: formatted,
                        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                    };
                });
                setScheduleData(enrichedData);
            })
            .catch((err) => console.error("Failed to fetch schedule", err));
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const timeSlotsBeforeSort= [...new Set(scheduleData
        .filter(schedule => schedule.schedule_type === "weekly")
        .flatMap(schedule =>
            schedule.weekly_schedule
                .filter(slot => slot.start_time)
                .map(slot => (slot.start_time?.toString().slice(0,5))
        )))];

    const timeSlots = timeSlotsBeforeSort.sort((a, b) => {
        const [aHours, aMinutes] = a.split(':').map(Number);
        const [bHours, bMinutes] = b.split(':').map(Number);

        if (aHours !== bHours) {
            return aHours - bHours;
        } else {
            return aMinutes - bMinutes;
        }
    });

    console.log(timeSlots);

    const getClassForSlot = (time, day) => {
        // Find the class that matches the time and day from weekly_schedule
        const cls = scheduleData.find((entry) =>
            entry.schedule_type === "weekly" &&
            entry.weekly_schedule.some(slot => slot.start_time?.toString().slice(0, 5) === time && slot.day === day)
        );
        return cls ? cls.title : "-";
    };

    const calculateDuration = (start, end) => {
        const [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);

        const startTotal = startHour * 60 + startMinute;
        const endTotal = endHour * 60 + endMinute;

        const durationMinutes = endTotal - startTotal;

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60

        if (minutes > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${hours}h`;
    };

    const classCategories = [
        { id: "all", name: "All Classes" },
        { id: "one-time", name: "One Time" },
        { id: "weekly", name: "Weekly" },
    ];

    const filteredClasses =
        filter === "all"
            ? scheduleData
            : scheduleData.filter((cls) => cls.schedule_type === filter);

    return (
        <div style={{width: "100vw"}}>
            <Navbar/>
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
                    <div className="max-w-3xl text-left">
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
                                        ? "bg-[#FF4500] text-white"
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
                                key={cls.schedule_id}
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
                                        <span className="bg-[#FF4500] text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {cls.schedule_type}
                    </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3">
                                        Instructor: {cls.full_name}
                                    </p>
                                    {cls.schedule_type === "one-time" && <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <span className="font-semibold mr-2">Schedule:</span>
                                            <span className="text-gray-600">{cls.schedule_date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Duration:</span>
                                            <span className="text-gray-600">{calculateDuration(cls.schedule_time_slot, cls.end_time)}</span>
                                        </div>
                                    </div>}
                                    <p className="text-gray-600 mb-4">{cls.notes}</p>
                                    {cls.schedule_type === "weekly" && <button
                                        className="text-[#FF4500] font-semibold hover:underline inline-flex items-center"
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
                                    </button>}
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
                            {timeSlots.map((time) => (
                                <tr key={time}>
                                    <td className="py-3 px-4 border-b border-gray-200 font-medium">{time}</td>
                                    {days.map((day) => (
                                        <td
                                            key={day}
                                            className={`py-3 px-4 border-b border-gray-200 ${
                                                getClassForSlot(time, day) !== "-" ? "bg-[#FF4500] bg-opacity-10" : ""
                                            }`}
                                        >
                                            {getClassForSlot(time, day)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#0A0A0A] text-white">
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
                            className="bg-white text-[#FF4500] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Become a Member
                        </Link>
                        {/*<Link*/}
                        {/*    to="/contact"*/}
                        {/*    className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"*/}
                        {/*>*/}
                        {/*    Try a Free Class*/}
                        {/*</Link>*/}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Classes;
