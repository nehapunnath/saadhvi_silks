import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        price: [],
        color: [],
        occasion: []
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const products = [
        {
            id: 1,
            name: "Kanjivaram Silk Saree",
            price: 12499,
            originalPrice: 15999,
            image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
            category: "Traditional",
            occasion: ["Wedding", "Festival"],
            colors: ["#891c3c", "#d4af37", "#1e3a8a"],
            description: "Authentic Kanjivaram silk with traditional motifs and pure zari work",
            badge: "Bestseller"
        },
        {
            id: 2,
            name: "Banarasi Silk Saree",
            price: 9999,
            originalPrice: 12499,
            image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            colors: ["#0f172a", "#7e22ce", "#be185d"],
            description: "Exquisite Banarasi silk with intricate brocade work",
            badge: "Popular"
        },
        {
            id: 3,
            name: "Designer Art Silk Saree",
            price: 7499,
            originalPrice: 9999,
            image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
            category: "Designer",
            occasion: ["Party", "Formal"],
            colors: ["#1e40af", "#dc2626", "#15803d"],
            description: "Contemporary designer saree with modern patterns",
            badge: "New"
        },
        {
            id: 4,
            name: "Tussar Silk Saree",
            price: 6299,
            originalPrice: 8499,
            image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            colors: ["#ca8a04", "#854d0e", "#f97316"],
            description: "Pure Tussar silk with natural texture and elegant drape"
        },
        {
            id: 5,
            name: "Organza Saree with Embroidery",
            price: 8799,
            originalPrice: 11299,
            image: "https://cdn.shopify.com/s/files/1/0755/3495/8865/files/bridal_1.png?v=1694446298",
            category: "Designer",
            occasion: ["Party", "Bridal"],
            colors: ["#f0abfc", "#c084fc", "#db2777"],
            description: "Sheer organza with intricate hand embroidery",
            badge: "Trending"
        },
        {
            id: 6,
            name: "Cotton Silk Saree",
            price: 4499,
            originalPrice: 5999,
            image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/c/7c90315SHMTPRM104_4.jpg?rnd=20200526195200&tr=w-512",
            category: "Daily Wear",
            occasion: ["Casual", "Formal"],
            colors: ["#0d9488", "#059669", "#65a30d"],
            description: "Comfortable cotton silk blend for everyday elegance"
        },
        {
            id: 7,
            name: "Bridal Lehenga Saree",
            price: 18999,
            originalPrice: 24999,
            image: "https://www.siyahisilks.com/cdn/shop/products/4_39_900x.jpg?v=1677233209",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            colors: ["#891c3c", "#d4af37", "#1e3a8a"],
            description: "Regal bridal lehenga saree with heavy embroidery",
            badge: "Premium"
        },
        {
            id: 8,
            name: "Hand Painted Silk Saree",
            price: 9299,
            originalPrice: 11799,
            image: "https://www.utsavfashion.com/cdn/shop/products/SKUCF_102209_1_900x.jpg?v=1571717598",
            category: "Designer",
            occasion: ["Festival", "Party"],
            colors: ["#7e22ce", "#3b82f6", "#ec4899"],
            description: "Artistic hand-painted silk with unique designs"
        },
        {
            id: 9,
            name: "Kalamkari Silk Saree",
            price: 7899,
            originalPrice: 9999,
            image: "https://www.kalkifashion.com/cdn/shop/products/yellow-printed-art-silk-saree-with-blouse-piece-kalki-fashion-style-328255_1024x1024.jpg?v=1676363499",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            colors: ["#f59e0b", "#84cc16", "#ef4444"],
            description: "Traditional Kalamkari art on pure silk",
            badge: "New"
        }
    ];

    const categories = ["Traditional", "Bridal", "Designer", "Daily Wear", "Premium"];
    const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];
    const prices = [
        { label: "Under ₹5,000", value: "0-5000" },
        { label: "₹5,000 - ₹10,000", value: "5000-10000" },
        { label: "₹10,000 - ₹15,000", value: "10000-15000" },
        { label: "Over ₹15,000", value: "15000-100000" }
    ];
    const colors = ["#891c3c", "#0f172a", "#1e40af", "#ca8a04", "#0d9488", "#7e22ce", "#f0abfc"];

    // Filter products based on selected filters
    useEffect(() => {
        let result = products;
        
        // Category filter
        if (selectedFilters.category.length > 0) {
            result = result.filter(product => 
                selectedFilters.category.includes(product.category)
            );
        }
        
        // Price filter
        if (selectedFilters.price.length > 0) {
            result = result.filter(product => {
                return selectedFilters.price.some(priceRange => {
                    const [min, max] = priceRange.split('-').map(Number);
                    return product.price >= min && product.price <= max;
                });
            });
        }
        
        // Occasion filter
        if (selectedFilters.occasion.length > 0) {
            result = result.filter(product => 
                product.occasion.some(occ => selectedFilters.occasion.includes(occ))
            );
        }
        
        // Color filter
        if (selectedFilters.color.length > 0) {
            result = result.filter(product => 
                product.colors.some(color => selectedFilters.color.includes(color))
            );
        }
        
        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedFilters]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
    };

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[filterType].includes(value)) {
                newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
            } else {
                newFilters[filterType] = [...newFilters[filterType], value];
            }
            return newFilters;
        });
    };

    const clearFilters = () => {
        setSelectedFilters({
            category: [],
            price: [],
            color: [],
            occasion: []
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-rose-50">
            {/* Header */}
            {/* <div className="bg-gradient-to-r from-rose-100 to-pink-200 py-16 shadow-md">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 text-center mb-4">Elegant Saree Collection</h1>
                    <p className="text-gray-700 text-center max-w-2xl mx-auto text-lg">
                        Discover our exquisite range of handcrafted sarees, meticulously crafted to bring out the elegance in every woman
                    </p>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Filter Button and Results Count */}
                <div className="flex justify-between items-center mb-8">
                    <div className="text-gray-600">
                        Showing {currentProducts.length} of {filteredProducts.length} products
                    </div>
                    <button
                        onClick={toggleFilter}
                        className="flex items-center bg-[#891c3c] text-white px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-[#6a1530] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </button>
                </div>

                {/* Filter Sidebar (Slides from right) */}
                <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleFilter}></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                                <div className="flex items-center">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#891c3c] hover:text-[#6a1530] mr-4"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={toggleFilter}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((category, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.category.includes(category)}
                                                onChange={() => handleFilterChange('category', category)}
                                            />
                                            <span className="ml-3 text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {prices.map((price, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.price.includes(price.value)}
                                                onChange={() => handleFilterChange('price', price.value)}
                                            />
                                            <span className="ml-3 text-gray-700">{price.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Occasion Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Occasion</h3>
                                <div className="space-y-2">
                                    {occasions.map((occasion, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.occasion.includes(occasion)}
                                                onChange={() => handleFilterChange('occasion', occasion)}
                                            />
                                            <span className="ml-3 text-gray-700">{occasion}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Color Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color, index) => (
                                        <button
                                            key={index}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedFilters.color.includes(color) ? 'border-gray-800 ring-2 ring-offset-1 ring-[#891c3c] scale-110' : 'border-gray-300 hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleFilterChange('color', color)}
                                            aria-label={`Filter by ${color} color`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Apply Filters Button for Mobile */}
                            <div className="md:hidden mt-8">
                                <button
                                    onClick={toggleFilter}
                                    className="w-full bg-[#891c3c] text-white py-3 rounded-lg font-medium hover:bg-[#6a1530] transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-gray-100">
                                <div className="relative overflow-hidden">
                                    {product.badge && (
                                        <span className="absolute top-4 left-4 bg-[#891c3c] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                                            {product.badge}
                                        </span>
                                    )}
                                    <div className="h-80 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#891c3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#891c3c] transition-colors duration-300">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center mt-2 mb-3">
                                        <span className="text-[#891c3c] font-bold text-lg">{formatPrice(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 text-sm line-through ml-2">{formatPrice(product.originalPrice)}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex">
                                            {product.colors.slice(0, 3).map((color, index) => (
                                                <div key={index} className="w-4 h-4 rounded-full border border-gray-200 mr-1" style={{backgroundColor: color}}></div>
                                            ))}
                                            {product.colors.length > 3 && (
                                                <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                                            )}
                                        </div>
                                        <Link to={'/viewdetails'}>
                                            <button className="bg-rose-50 text-[#891c3c] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#891c3c] hover:text-white transition-all duration-300">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                        <button 
                            onClick={clearFilters}
                            className="mt-4 bg-[#891c3c] text-white px-6 py-2 rounded-lg hover:bg-[#6a1530] transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {filteredProducts.length > productsPerPage && (
                    <div className="flex justify-center mt-16">
                        <nav className="flex items-center space-x-2">
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-[#891c3c] text-white' : 'text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;