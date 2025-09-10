import React, { useState } from 'react';

const Products = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        price: [],
        color: [],
        occasion: []
    });

    const products = [
        {
            id: 1,
            name: "Kanjivaram Silk Saree",
            price: "₹12,499",
            // originalPrice: "₹15,999",
            image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
            category: "Traditional",
            occasion: ["Wedding", "Festival"],
            //   colors: ["#891c3c", "#d4af37", "#1e3a8a"],
            description: "Authentic Kanjivaram silk with traditional motifs and pure zari work",
            badge: "Bestseller"
        },
        {
            id: 2,
            name: "Banarasi Silk Saree",
            price: "₹9,999",
            // originalPrice: "₹12,499",
            image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            //   colors: ["#0f172a", "#7e22ce", "#be185d"],
            description: "Exquisite Banarasi silk with intricate brocade work",
            badge: "Popular"
        },
        {
            id: 3,
            name: "Designer Art Silk Saree",
            price: "₹7,499",
            // originalPrice: "₹9,999",
            image: "https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577",
            category: "Designer",
            occasion: ["Party", "Formal"],
            //   colors: ["#1e40af", "#dc2626", "#15803d"],
            description: "Contemporary designer saree with modern patterns",
            badge: "New"
        },
        {
            id: 4,
            name: "Tussar Silk Saree",
            price: "₹6,299",
            // originalPrice: "₹8,499",
            image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            //   colors: ["#ca8a04", "#854d0e", "#f97316"],
            description: "Pure Tussar silk with natural texture and elegant drape"
        },
        {
            id: 5,
            name: "Organza Saree with Embroidery",
            price: "₹8,799",
            originalPrice: "₹11,299",
            image: "https://cdn.shopify.com/s/files/1/0755/3495/8865/files/bridal_1.png?v=1694446298",
            category: "Designer",
            occasion: ["Party", "Bridal"],
            //   colors: ["#f0abfc", "#c084fc", "#db2777"],
            description: "Sheer organza with intricate hand embroidery",
            badge: "Trending"
        },
        {
            id: 6,
            name: "Cotton Silk Saree",
            price: "₹4,499",
            // originalPrice: "₹5,999",
            image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/c/7c90315SHMTPRM104_4.jpg?rnd=20200526195200&tr=w-512",
            category: "Daily Wear",
            occasion: ["Casual", "Formal"],
            //   colors: ["#0d9488", "#059669", "#65a30d"],
            description: "Comfortable cotton silk blend for everyday elegance"
        },
        // {
        //     id: 7,
        //     name: "Bridal Lehenga Saree",
        //     price: "₹18,999",
        //     originalPrice: "₹24,999",
        //     image: "https://www.siyahisilks.com/cdn/shop/products/4_39_900x.jpg?v=1677233209",
        //     category: "Bridal",
        //     occasion: ["Wedding", "Bridal"],
        //     //   colors: ["#891c3c", "#d4af37", "#1e3a8a"],
        //     description: "Regal bridal lehenga saree with heavy embroidery",
        //     badge: "Premium"
        // },
        // {
        //     id: 8,
        //     name: "Hand Painted Silk Saree",
        //     price: "₹9,299",
        //     originalPrice: "₹11,799",
        //     image: "https://www.utsavfashion.com/cdn/shop/products/SKUCF_102209_1_900x.jpg?v=1571717598",
        //     category: "Designer",
        //     occasion: ["Festival", "Party"],
        //     //   colors: ["#7e22ce", "#3b82f6", "#ec4899"],
        //     description: "Artistic hand-painted silk with unique designs"
        // }
    ];

    const categories = ["Traditional", "Bridal", "Designer", "Daily Wear", "Premium"];
    const occasions = ["Wedding", "Bridal", "Festival", "Party", "Formal", "Casual"];
    const prices = [
        { label: "Under ₹5,000", value: "0-5000" },
        { label: "₹5,000 - ₹10,000", value: "5000-10000" },
        { label: "₹10,000 - ₹15,000", value: "10000-15000" },
        { label: "Over ₹15,000", value: "15000-100000" }
    ];
    //   const colors = ["#891c3c", "#0f172a", "#1e40af", "#ca8a04", "#0d9488", "#7e22ce", "#f0abfc"];

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

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 text-center mb-4">Our Saree Collection</h1>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto">
                        Discover our exquisite range of silk sarees, meticulously crafted to bring out the elegance in every woman
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`md:w-1/4 ${filterOpen ? 'block' : 'hidden'} md:block`}>
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-[#891c3c] hover:text-[#6a1530]"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((category, index) => (
                                        <label key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.category.includes(category)}
                                                onChange={() => handleFilterChange('category', category)}
                                            />
                                            <span className="ml-2 text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {prices.map((price, index) => (
                                        <label key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.price.includes(price.value)}
                                                onChange={() => handleFilterChange('price', price.value)}
                                            />
                                            <span className="ml-2 text-gray-700">{price.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Occasion Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Occasion</h3>
                                <div className="space-y-2">
                                    {occasions.map((occasion, index) => (
                                        <label key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#891c3c] focus:ring-[#891c3c]"
                                                checked={selectedFilters.occasion.includes(occasion)}
                                                onChange={() => handleFilterChange('occasion', occasion)}
                                            />
                                            <span className="ml-2 text-gray-700">{occasion}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Color Filter */}
                            {/* <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 ${selectedFilters.color.includes(color) ? 'border-gray-800 ring-2 ring-offset-1 ring-[#891c3c]' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleFilterChange('color', color)}
                      aria-label={`Filter by ${color} color`}
                    />
                  ))}
                </div>
              </div> */}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="md:w-3/4">
                        {/* Mobile Filter Toggle */}
                        <div className="md:hidden flex justify-between items-center mb-6">
                            <button
                                onClick={toggleFilter}
                                className="flex items-center text-[#891c3c] font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </button>
                            <div className="text-sm text-gray-600">{products.length} products</div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group">
                                    <div className="relative overflow-hidden">
                                        {product.badge && (
                                            <span className="absolute top-4 left-4 bg-[#891c3c] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                                                {product.badge}
                                            </span>
                                        )}
                                        <div className="h-72 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#891c3c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#891c3c] transition-colors duration-300">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                                        <div className="flex items-center mt-2 mb-3">
                                            <span className="text-[#891c3c] font-bold">{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 text-sm line-through ml-2">{product.originalPrice}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                      {/* <div className="flex">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <div key={index} className="w-4 h-4 rounded-full border border-gray-200 mr-1" style={{backgroundColor: color}}></div>
                        ))}
                        {product.colors.length > 3 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                        )}
                      </div> */}
                      <button className="bg-rose-50 text-[#891c3c] px-3 py-1 rounded text-sm font-medium hover:bg-[#891c3c] hover:text-white transition-all duration-300">
                        View Details
                      </button>
                    </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {/* <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]">
                  Previous
                </button>
                <button className="px-3 py-1 rounded border bg-[#891c3c] text-white">1</button>
                <button className="px-3 py-1 rounded border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]">2</button>
                <button className="px-3 py-1 rounded border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]">3</button>
                <span className="px-2 text-gray-600">...</span>
                <button className="px-3 py-1 rounded border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]">8</button>
                <button className="px-3 py-1 rounded border text-gray-600 hover:bg-rose-50 hover:text-[#891c3c]">
                  Next
                </button>
              </nav>
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;