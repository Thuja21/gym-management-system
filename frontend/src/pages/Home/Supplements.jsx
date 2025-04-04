import React from "react";
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaStar, FaCheck, FaTimes, FaMinus, FaPlus, FaFire } from 'react-icons/fa'
import { Star, ShoppingCart } from 'lucide-react';
import Navbar from "../../components/Member/Navbar.jsx"

const Supplements = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all"); // Default: Show all
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedSupplement, setSelectedSupplement] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [supplements, setSupplements] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");

    // Fetch supplements from backend
    useEffect(() => {
        const fetchSupplements = async () => {
            try {
                const response = await fetch("http://localhost:8800/api/supplements/all"); // Update with your backend URL
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
    }, [loading]);


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

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1)
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const ProductModal = ({ supplement }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 " >
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
                                        ? supplement.image_url  // External URL
                                        : `http://localhost:8800${supplement.image_url || ''}` // Local image path or fallback
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
                            <p className="text-gray-600 mb-4">{supplement.description}</p>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Size: {supplement.size}</h3>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Quantity:</h3>
                                <div className="flex items-center space-x-4">
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

                            <div className="flex flex-col space-y-3">
                                <button className="w-full bg-[#FF4500] text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300 flex items-center justify-center">
                                    <FaShoppingCart className="mr-2" />
                                    Add to Cart
                                </button>
                                <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )

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
                    <div className="flex flex-wrap justify-center gap-4">
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

                        <select className="p-2 rounded bg-white border ml-[100px]" onChange={(e) => setSortBy(e.target.value)}>
                            <option value="default">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 md:px-6">
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
                                                ? supplement.image_url  // External URL
                                                : `http://localhost:8800${supplement.image_url || ''}` // Local image path or fallback
                                        }
                                        alt={supplement.supplement_name}
                                        className="w-full h-44 object-contain"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="p-4 text-left flex flex-col flex-1">
                                    <div className="text-sm text-gray-500 mb-1">{supplement.category}</div>
                                    <h3 className="text-lg font-semibold mb-2">{supplement.supplement_name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{supplement.description}</p>

                                    {/* Price & Button - Always at Bottom */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-bold">Rs.{supplement.price}</span>
                                        <button className="flex items-center bg-[#FF4500] text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Product Modal */}
            <AnimatePresence>
                {selectedSupplement && (
                    <ProductModal supplement={selectedSupplement} />
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