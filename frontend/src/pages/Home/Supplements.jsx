import React from "react";
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaStar, FaCheck, FaTimes, FaMinus, FaPlus, FaFire } from 'react-icons/fa'
import Navbar from "../../components/Member/Navbar.jsx"

const Supplements = () => {
    const [category, setCategory] = useState('all')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)

    const categories = [
        { id: 'top-sellers', name: 'Top Sellers' },
        { id: 'energy-drinks', name: 'Energy Drinks' },
        { id: 'protein', name: 'Protein' },
        { id: 'all', name: 'All Products' },
    ]

    const supplements = [
        {
            id: 1,
            name: "Premium Whey Protein",
            category: "protein",
            isTopSeller: true,
            image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            price: 2499,
            rating: 5,
            description: "High-quality whey protein with 24g protein per serving. Perfect for muscle recovery and growth.",
            features: [
                "24g protein per serving",
                "Low in carbs and fat",
                "Mixes instantly",
                "Great taste"
            ],
            variants: ["Chocolate", "Vanilla", "Strawberry"],
            size: "1 kg",
            servings: 30
        },
        {
            id: 2,
            name: "Power Energy Drink",
            category: "energy-drinks",
            isTopSeller: true,
            image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            price: 149,
            rating: 5,
            description: "Sugar-free energy drink packed with B-vitamins and electrolytes for sustained energy.",
            features: [
                "Zero sugar",
                "Natural caffeine",
                "B-vitamin complex",
                "Electrolytes"
            ],
            variants: ["Original", "Tropical", "Berry Blast"],
            size: "500ml",
            servings: 1
        },
        {
            id: 3,
            name: "BCAA Energy Drink",
            category: "energy-drinks",
            isTopSeller: false,
            image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            price: 179,
            rating: 4,
            description: "BCAA-enriched energy drink for improved recovery and sustained energy during workouts.",
            features: [
                "5g BCAAs per serving",
                "Natural caffeine",
                "Zero sugar",
                "Electrolytes"
            ],
            variants: ["Lemon Lime", "Orange Mango", "Grape"],
            size: "500ml",
            servings: 1
        },
        {
            id: 4,
            name: "Mass Gainer Pro",
            category: "protein",
            isTopSeller: true,
            image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            price: 2999,
            rating: 5,
            description: "High-calorie mass gainer with premium proteins and complex carbs for muscle gain.",
            features: [
                "1250 calories per serving",
                "50g protein per serving",
                "Complex carbohydrates",
                "Added vitamins and minerals"
            ],
            variants: ["Chocolate", "Vanilla", "Cookies & Cream"],
            size: "3 kg",
            servings: 20
        }
    ]

    const filteredSupplements = category === 'all'
        ? supplements
        : category === 'top-sellers'
            ? supplements.filter(supp => supp.isTopSeller)
            : supplements.filter(supp => supp.category === category)

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1)
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const ProductModal = ({ product }) => (
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
                                setSelectedProduct(null)
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
                                src={product.image}
                                alt={product.name}
                                className="w-full h-80 object-cover rounded-lg"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold">{product.name}</h2>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400 mr-2">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <span className="text-gray-600">({product.rating}/5)</span>
                            </div>

                            <div className="text-3xl font-bold text-[#FF4500] mb-4">
                                ₹{product.price.toLocaleString()}
                            </div>

                            <p className="text-gray-600 mb-4">{product.description}</p>

                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Size: {product.size}</h3>
                                <p className="text-gray-600">Servings: {product.servings}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Available Flavors:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                        >
                      {variant}
                    </span>
                                    ))}
                                </div>
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

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Product Features</h3>
                        <ul className="space-y-2">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-gray-600">
                                    <FaCheck className="text-[#FF4500] mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
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
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                    category === cat.id
                                        ? 'bg-[#FF4500] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredSupplements.map((supplement, index) => (
                            <motion.div
                                key={supplement.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => {
                                    setSelectedProduct(supplement)
                                    setQuantity(1)
                                }}
                            >
                                <div className="relative">
                                    <img
                                        src={supplement.image}
                                        alt={supplement.name}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{supplement.name}</h3>
                                    <div className="text-2xl font-bold text-[#FF4500] mb-4">
                                        Rs.{supplement.price.toLocaleString()}
                                    </div>
                                    <button className="w-full bg-[#FF4500] text-white font-semibold py-2 px-6 rounded-md hover:bg-opacity-90 transition duration-300">
                                        Buy Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal product={selectedProduct} />
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