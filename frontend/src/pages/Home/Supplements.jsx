import React from "react";
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa'
import { ShoppingCart, Calendar } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx"
import { toast } from 'react-toastify';

const Supplements = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSupplement, setSelectedSupplement] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [supplements, setSupplements] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const [reservations, setReservations] = useState([]);
    const [showReservations, setShowReservations] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [reservationItem, setReservationItem] = useState(null);
    const isLoggedIn = localStorage.getItem("user") !== null;

    const fetchReservations = async () => {
        if (isLoggedIn) {
            try {
                setLoading(true);
                // Assuming you have user authentication and can get the user ID
                const response = await fetch("http://localhost:8800/api/reservations/all", {
                    method: "GET",
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    const currentDate = new Date();

                    const processedReservations = [];
                    const updatePromises = [];

                    for (const reservation of data) {
                        const expiryDate = new Date(reservation.expiry_date);

                        // Check if reservation is pending and has expired
                        if (reservation.status === 'pending' && expiryDate < currentDate) {
                            console.log("Pending Expired Reservation:", reservation);
                            // Update the status in the database
                            const updatePromise = fetch(`http://localhost:8800/api/reservations/status/${reservation.reservation_id}`, {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({ status: 'expired' })
                            }).then(response => {
                                if (!response.ok) {
                                    console.error(`Failed to update reservation ${reservation.reservation_id} status to expired`);
                                }
                                return { ...reservation, status: 'expired' };
                            }).catch(err => {
                                console.error(`Error updating reservation ${reservation.reservation_id}:`, err);
                                return { ...reservation, status: 'expired' }; // Still show as expired in UI even if DB update fails
                            });

                            updatePromises.push(updatePromise);
                            processedReservations.push({ ...reservation, status: 'expired' });
                        } else {
                            processedReservations.push(reservation);
                        }
                    }
                    // Wait for all update operations to complete
                    if (updatePromises.length > 0) {
                        await Promise.allSettled(updatePromises);
                        console.log(`Updated ${updatePromises.length} expired reservations in the database`);
                    }

                    setReservations(processedReservations);
                }
            } catch (err) {
                console.error("Failed to fetch reservations:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Fetch supplements from backend
    useEffect(() => {
        const fetchSupplements = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/supplements/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch supplements.");
                }
                const data = await response.json();
                setSupplements(data);

                // Extract unique categories
                const uniqueCategories = [
                    ...new Set(data.map((item) => item.category))
                ].map((category) => ({
                    id: category.toLowerCase().replace(/\s+/g, "-"),
                    name: category,
                }));

                setCategories([{ id: "all", name: "All" }, ...uniqueCategories]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplements();
        // if (isLoggedIn) {
        //     fetchReservations();
        // }
    }, [loading, isLoggedIn]);

    // Filter supplements based on selected category
    const filteredSupplements =
        selectedCategory === "all"
            ? supplements
            : supplements.filter((supp) => supp.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory);

    const sortedSupplements = [...filteredSupplements].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.supplement_name.localeCompare(b.supplement_name);
        return 0;
    });

    // const handleQuantityChange = (action) => {
    //     if (action === 'increase') {
    //         setQuantity(prev => prev + 1)
    //     } else if (action === 'decrease' && quantity > 1) {
    //         setQuantity(prev => prev - 1)
    //     }
    // }

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            if (quantity < selectedSupplement.quantity_in_stock) {
                setQuantity(prev => prev + 1)
            } else {
                toast.warning(`Only ${selectedSupplement.quantity_in_stock} items available in stock!`);
            }
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }


    const handleReservation = async () => {
        try {
            if (!isLoggedIn) {
                toast.error("Please log in to reserve supplements");
                window.location.href = "/login";
                return;
            }

            // Check if requested quantity exceeds available stock
            if (quantity > selectedSupplement.quantity_in_stock) {
                toast.error(`Cannot reserve more than ${selectedSupplement.quantity_in_stock} items`);
                return;
            }

            // Check if item is in stock
            if (selectedSupplement.quantity_in_stock === 0) {
                toast.error("This item is out of stock");
                return;
            }

            const reservationData = {
                supplementId: selectedSupplement.supplement_id,
                quantity,
                status: "pending",
                reservationDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalPrice: selectedSupplement.price * quantity
            };

            const response = await fetch("http://localhost:8800/api/reservations/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                alert("✅ Supplement reserved successfully! Please collect and pay within 7 days.");
                setSelectedSupplement(null);
                setQuantity(1);

                //
                fetchReservations();
            } else {
                toast.error("Failed to reserve supplement. Please try again.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
            console.error(err);
        }
    };

    const cancelReservation = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:8800/api/reservations/cancel/${reservationId}`, {
                method: "PUT",
                credentials: 'include',
            });

            if (response.ok) {
                alert("✅ Reservation cancelled successfully");

                // Update local reservations state
                setReservations(prev => prev.map(reservation =>
                    reservation.reservation_id === reservationId
                        ? {...reservation, status: 'cancelled'}
                        : reservation
                ));

                const reservation = reservations.find(res => res.reservation_id === reservationId);
                if (reservation) {
                    // Update local supplements state
                    setSupplements(prev => prev.map(supplement =>
                        supplement.supplement_id === reservation.supplement_id
                            ? {...supplement, quantity_in_stock: supplement.quantity_in_stock + reservation.quantity}
                            : supplement
                    ));
                }
                setConfirmModal(false);
            } else {
                toast.error("Failed to cancel reservation");
            }
        } catch (err) {
            toast.error("An error occurred");
            console.error(err);
        }
    };

    const ProductModal = ({ supplement }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setSelectedSupplement(null)
                                setQuantity(1)
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img
                                src={
                                    supplement.image_url && supplement.image_url.startsWith('http')
                                        ? supplement.image_url
                                        : `http://localhost:8800${supplement.image_url || ''}`
                                }
                                alt={supplement.supplement_name}
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold">{supplement.supplement_name}</h2>
                            </div>
                            <div className="text-3xl font-bold text-[#FF4500] mb-4">
                                Rs.{supplement.price}
                            </div>
                            <div className="flex items-center mb-2">
                                <span className="text-sm font-medium mr-1">Available:</span>
                                <span className={`text-sm ${supplement.quantity_in_stock > 10 ? 'text-green-600' : supplement.quantity_in_stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {supplement.quantity_in_stock > 0 ? `${supplement.quantity_in_stock} in stock` : 'Out of stock'}
                                            </span>
                            </div>
                            <p className="text-gray-600 mb-4">{supplement.description}</p>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Size: {supplement.size}</h3>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Quantity:</h3>
                                <div className="flex items-center space-x-4 ">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                                        disabled={quantity <= 1}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="text-xl font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Total Price:</h3>
                                <p className="text-2xl font-bold text-[#FF4500]">
                                    Rs.{(supplement.price * quantity).toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <strong>Reservation Policy:</strong> Reserved items must be collected and paid for at the gym within 7 days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={isLoggedIn ? handleReservation : () => window.location.href = "/login"}
                                    disabled={selectedSupplement.quantity_in_stock === 0}
                                    className={`w-full font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center ${
                                        selectedSupplement.quantity_in_stock === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#FF4500] text-white hover:bg-opacity-90"
                                    }`}
                                >
                                    <Calendar className="mr-2" />
                                    {selectedSupplement.quantity_in_stock === 0 ? "Out of Stock" : "Reserve Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'collected':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const ReservationsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">My Reservations</h2>
                        <button
                            onClick={() => setShowReservations(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {reservations.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You have no active reservations.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Product</th>
                                    <th className="py-3 px-6 text-left">Quantity</th>
                                    <th className="py-3 px-6 text-left">Total Price</th>
                                    <th className="py-3 px-6 text-left">Reserved On</th>
                                    <th className="py-3 px-6 text-left">Expires On</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm">
                                {reservations.map((reservation) => {
                                    const supplement = supplements.find(s => s.supplement_id === reservation.supplement_id);
                                    const reservationDate = new Date(reservation.reservation_date).toLocaleDateString();
                                    const expiryDate = new Date(reservation.expiry_date).toLocaleDateString();

                                    return (
                                        <tr key={reservation.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-6 text-left">
                                                {supplement ? supplement.supplement_name : 'Unknown Product'}
                                            </td>
                                            <td className="py-3 px-6 text-left">{reservation.quantity}</td>
                                            <td className="py-3 px-6 text-left">Rs.{reservation.total_price}</td>
                                            <td className="py-3 px-6 text-left">{reservationDate}</td>
                                            <td className="py-3 px-6 text-left">{expiryDate}</td>
                                            <td className="py-3 px-6 text-left">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    getStatusChipColor(reservation.status)
                                                }`}>
                                                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {reservation.status === 'pending' && (
                                                    <button
                                                        onClick={() => {
                                                            setReservationItem(reservation);
                                                            setConfirmModal(true);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    const ConfirmCancelModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg w-full max-w-md p-6"
            >
                <h3 className="text-xl font-bold mb-4">Cancel Reservation</h3>
                <p className="mb-6">Are you sure you want to cancel this reservation? This action cannot be undone.</p>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setConfirmModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        No, Keep It
                    </button>
                    <button
                        onClick={() => cancelReservation(reservationItem.reservation_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div style={{width: "100vw"}}>
            <Navbar/>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0A0A0A] text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                    }}
                ></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-left">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Supplements</h1>
                        <p className="text-xl text-gray-300">
                            Premium quality supplements to support your fitness journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between mb-4 mt-4">
                        <div className="flex flex-wrap gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                        selectedCategory === cat.id
                                            ? "bg-[#FF4500] text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4  md:mt-0">
                            <select
                                className="p-2 rounded bg-white border"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">Sort By</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>

                            {isLoggedIn && (
                                <button
                                    onClick={() => {
                                        fetchReservations();
                                        setShowReservations(true)
                                    }}
                                    className="flex items-center bg-[#FF4500] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    My Reservations
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reservation Info Banner */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-[50px]">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Reservation System:</strong> Reserve your supplements now and pay at the gym within 7 days. No online payment required!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 md:px-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4500]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-8">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {sortedSupplements.map((supplement, index) => (
                                <motion.div
                                    key={supplement.supplement_id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer flex flex-col h-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => {
                                        setSelectedSupplement(supplement);
                                        setQuantity(1);
                                    }}
                                >
                                    {/* Image Section */}
                                    <div className="relative">
                                        <img
                                            src={
                                                supplement.image_url && supplement.image_url.startsWith('http')
                                                    ? supplement.image_url
                                                    : `http://localhost:8800${supplement.image_url || ''}`
                                            }
                                            alt={supplement.supplement_name}
                                            className="w-full h-44 object-contain"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-4 text-left flex flex-col flex-1">
                                        <div className="text-sm text-gray-500 mb-1">{supplement.category}</div>
                                        <h3 className="text-lg font-semibold mb-2">{supplement.supplement_name}</h3>
                                        {/* Add this line to show available quantity */}
                                        <div className="flex items-center mb-2">
                                            <span className="text-sm font-medium mr-1">Available:</span>
                                            <span className={`text-sm ${supplement.quantity_in_stock > 10 ? 'text-green-600' : supplement.quantity_in_stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {supplement.quantity_in_stock > 0 ? `${supplement.quantity_in_stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{supplement.description}</p>

                                        {/* Price & Button - Always at Bottom */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-bold">Rs.{supplement.price}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isLoggedIn) {
                                                        window.location.href = "/login";
                                                    } else if (supplement.quantity_in_stock === 0) {
                                                        toast.warning("This item is out of stock");
                                                    } else {
                                                        setSelectedSupplement(supplement);
                                                        setQuantity(1);
                                                    }
                                                }}
                                                disabled={supplement.quantity_in_stock === 0}
                                                className={`flex items-center font-semibold py-2 px-6 rounded-md transition duration-300 ${
                                                    supplement.quantity_in_stock === 0
                                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                                        : "bg-[#FF4500] text-white hover:bg-opacity-90"
                                                }`}
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {supplement.quantity_in_stock === 0 ? "Out of Stock" : "Reserve"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            <AnimatePresence>
                {selectedSupplement && (
                    <ProductModal supplement={selectedSupplement} />
                )}
                {showReservations && isLoggedIn && (
                    <ReservationsModal />
                )}
                {confirmModal && reservationItem && (
                    <ConfirmCancelModal />
                )}
            </AnimatePresence>

            {/* CTA Section */}
            <section className="py-20 bg-[#0A0A0A] text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Need Help Choosing Supplements?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Our experts are here to help you select the right supplements for
                        your fitness goals.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-white text-[#FF4500] font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Get Expert Advice
                        </Link>
                        <a
                            href="tel:+11234567890"
                            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-primary transition duration-300"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Supplements