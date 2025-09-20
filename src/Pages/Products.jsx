import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        price: [],
        occasion: []
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const products = [
        // Traditional (8 products)
        {
            id: 1,
            name: "Kanjivaram Silk Saree",
            price: 12499,
            originalPrice: 15999,
            image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
            category: "Traditional",
            occasion: ["Wedding", "Festival"],
            description: "Authentic Kanjivaram silk with traditional motifs and pure zari work",
            badge: "Bestseller"
        },
        {
            id: 4,
            name: "Tussar Silk Saree",
            price: 6299,
            originalPrice: 8499,
            image: "https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            description: "Pure Tussar silk with natural texture and elegant drape"
        },
        {
            id: 9,
            name: "Kalamkari Silk Saree",
            price: 7899,
            originalPrice: 9999,
            image: "https://i.pinimg.com/736x/1c/ae/e9/1caee9eb709f8cf6eb9e275bda408be1.jpg",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            description: "Traditional Kalamkari art on pure silk",
            badge: "New"
        },
        {
            id: 10,
            name: "Chanderi Silk Saree",
            price: 6999,
            originalPrice: 8999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIl2gkVmm1IuAXGU2P1kZ_XypEQGGViSanMw&s",
            category: "Traditional",
            occasion: ["Festival", "Formal"],
            description: "Lightweight Chanderi silk with delicate zari weaving",
            badge: "Popular"
        },
        {
            id: 14,
            name: "Mysore Silk Saree",
            price: 8499,
            originalPrice: 10999,
            image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0070_580x.jpg?v=1571711124",
            category: "Traditional",
            occasion: ["Wedding", "Festival"],
            description: "Pure Mysore silk with rich zari borders",
            badge: "Bestseller"
        },
        {
            id: 17,
            name: "Bandhani Silk Saree",
            price: 8299,
            originalPrice: 10499,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS91ZPOMCrP8CD7skomIP1mI-obBtui3lAClA&s",
            category: "Traditional",
            occasion: ["Festival", "Party"],
            description: "Traditional Bandhani silk with tie-dye patterns",
            badge: "New"
        },
        {
            id: 21,
            name: "Dharmavaram Silk Saree",
            price: 11999,
            originalPrice: 14999,
            image: "https://pionexfab.com/product-img/royal-blue-pure-silk-dharmavar-1725441514.jpg",
            category: "Traditional",
            occasion: ["Wedding", "Formal"],
            description: "Rich Dharmavaram silk with intricate zari patterns",
            badge: "Trending"
        },
        {
            id: 22,
            name: "Patola Silk Saree",
            price: 13999,
            originalPrice: 17999,
            image: "https://www.theweavesart.com/cdn/shop/files/PatanPatolaSingleIkatSilkSaree_800x.png?v=1685019509",
            category: "Traditional",
            occasion: ["Wedding", "Festival"],
            description: "Handwoven Patola silk with vibrant geometric designs",
            badge: "Premium"
        },
        // Bridal (8 products)
        {
            id: 2,
            name: "Banarasi Silk Saree",
            price: 9999,
            originalPrice: 12499,
            image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Exquisite Banarasi silk with intricate brocade work",
            badge: "Popular"
        },
        {
            id: 7,
            name: "Bridal Lehenga Saree",
            price: 18999,
            originalPrice: 24999,
            image: "https://assets0.mirraw.com/images/94575/b8e9f725abec95ae26ae5609d1f69bca_zoom.jpg?1536740731",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Regal bridal lehenga saree with heavy embroidery",
            badge: "Premium"
        },
        {
            id: 15,
            name: "Velvet Bridal Saree",
            price: 17999,
            originalPrice: 22999,
            image: "https://aghanoorbridal.com/cdn/shop/files/WhatsAppImage2023-11-25at07.22.14_1_1366x.jpg?v=1755262935",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Luxurious velvet saree with heavy embroidery for bridal elegance",
            badge: "Premium"
        },
        {
            id: 23,
            name: "Zari Embroidered Bridal Saree",
            price: 16999,
            originalPrice: 21999,
            image: "https://anantfashion.in/cdn/shop/products/4-1-1.jpg?v=1709820034&width=1445",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Opulent silk saree with heavy zari embroidery",
            badge: "Bestseller"
        },
        {
            id: 24,
            name: "Kanchipuram Bridal Saree",
            price: 15999,
            originalPrice: 19999,
            image: "https://priyangaa.in/cdn/shop/files/127c.jpg?v=1717921093",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Traditional Kanchipuram silk with ornate zari work",
            badge: "Trending"
        },
        {
            id: 25,
            name: "Embroidered Silk Bridal Saree",
            price: 14999,
            originalPrice: 18999,
            image: "https://www.singhanias.in/cdn/shop/products/391115_1.jpg?v=1756455637",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Silk saree with intricate thread and sequin embroidery"
        },
        {
            id: 26,
            name: "Heavy Banarasi Bridal Saree",
            price: 19999,
            originalPrice: 25999,
            image: "https://www.rajendra.co/cdn/shop/files/Pink-Purple-Pure-Georgette-Banarasi-Bandhani-Saree-2.jpg?v=1699272621",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Luxurious Banarasi silk with heavy zari and brocade",
            badge: "Premium"
        },
        {
            id: 27,
            name: "Net Bridal Saree with Sequins",
            price: 12999,
            originalPrice: 16999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbj5msWDrYGEwcVXHhl52eSEmDgc1G-HyAng&s",
            category: "Bridal",
            occasion: ["Wedding", "Bridal"],
            description: "Elegant net saree with sparkling sequin work",
            badge: "New"
        },
        // Designer (8 products)
        {
            id: 3,
            name: "Designer Art Silk Saree",
            price: 7499,
            originalPrice: 9999,
            image: "https://templedesigner.com/cdn/shop/files/DSC09301.jpg?v=1718716907",
            category: "Designer",
            occasion: ["Party", "Formal"],
            description: "Contemporary designer saree with modern patterns",
            badge: "New"
        },
        {
            id: 5,
            name: "Organza Saree with Embroidery",
            price: 8799,
            originalPrice: 11299,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsp3Q8TMSndOWj1anh_uzn307sNvqW2pxesA&s",
            category: "Designer",
            occasion: ["Party", "Bridal"],
            description: "Sheer organza with intricate hand embroidery",
            badge: "Trending"
        },
        {
            id: 8,
            name: "Hand Painted Silk Saree",
            price: 9299,
            originalPrice: 11799,
            image: "https://panaah.co/cdn/shop/products/Madhubani-7.jpg?v=1710253167&width=1600",
            category: "Designer",
            occasion: ["Festival", "Party"],
            description: "Artistic hand-painted silk with unique designs"
        },
        {
            id: 13,
            name: "Embroidered Net Saree",
            price: 10999,
            originalPrice: 13999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn=0GcRbj5msWDrYGEwcVXHhl52eSEmDgc1G-HyAng&s",
            category: "Designer",
            occasion: ["Party", "Bridal"],
            description: "Glamorous net saree with sequin and thread embroidery",
            badge: "Trending"
        },
        {
            id: 18,
            name: "Georgette Designer Saree",
            price: 9499,
            originalPrice: 11999,
            image: "https://akrithi.com/cdn/shop/products/fullsizeoutput_113d.jpeg?v=1538161310",
            category: "Designer",
            occasion: ["Party", "Formal"],
            description: "Elegant georgette saree with intricate sequin work",
            badge: "Trending"
        },
        {
            id: 28,
            name: "Satin Designer Saree",
            price: 7999,
            originalPrice: 9999,
            image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/64b699093ac02bc8756292ba/db985517-2b8c-4e44-9c09-5e55b2204070.jpg",
            category: "Designer",
            occasion: ["Party", "Formal"],
            description: "Smooth satin saree with modern embroidery patterns",
            badge: "New"
        },
        // Daily Wear (8 products)
        {
            id: 6,
            name: "Cotton Silk Saree",
            price: 4499,
            originalPrice: 5999,
            image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/7/c/7c90315SHMTPRM104_4.jpg?rnd=20200526195200&tr=w-512",
            category: "Daily Wear",
            occasion: ["Casual", "Formal"],
            description: "Comfortable cotton silk blend for everyday elegance"
        },
        {
            id: 12,
            name: "Linen Silk Saree",
            price: 5699,
            originalPrice: 7499,
            image: "https://images.meesho.com/images/products/538705150/lx0an_512.jpg",
            category: "Daily Wear",
            occasion: ["Casual", "Formal"],
            description: "Breathable linen silk blend with subtle elegance"
        },
        {
            id: 16,
            name: "Printed Cotton Saree",
            price: 3999,
            originalPrice: 5499,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn=0GcTMMl91ReZMnFuUw2CTVCNT7JLyIgY5KKHl_A&s",
            category: "Daily Wear",
            occasion: ["Casual"],
            description: "Vibrant printed cotton saree for everyday wear"
        },
        {
            id: 20,
            name: "Chiffon Printed Saree",
            price: 4999,
            originalPrice: 6999,
            image: "https://kotharisons.com/cdn/shop/files/IMG_1091_09dc2362-d8a1-456b-91a5-590d3355fc45.jpg?v=1716802645&width=1946",
            category: "Daily Wear",
            occasion: ["Casual", "Party"],
            description: "Lightweight chiffon saree with vibrant prints"
        },
        {
            id: 31,
            name: "Cotton Blend Saree",
            price: 3499,
            originalPrice: 4999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn=0GcQ7_RVLR3NMmRKokuH6aAeF6lrA-7FK8wmlEQ&s",
            category: "Daily Wear",
            occasion: ["Casual", "Formal"],
            description: "Soft cotton blend saree for daily comfort",
            badge: "New"
        },
        {
            id: 32,
            name: "Handwoven Cotton Saree",
            price: 4299,
            originalPrice: 5999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn=0GcRqp2G-Lx31WIOQHXDfo6ImpDo7i6AJoVIXlhQyY9_zzu_9P0dYOWwEHZUK1d2jRcsL9sk&usqp=CAU",
            category: "Daily Wear",
            occasion: ["Casual"],
            description: "Handwoven cotton saree with traditional patterns"
        },
        // Premium (8 products)
        {
            id: 11,
            name: "Paithani Silk Saree",
            price: 15499,
            originalPrice: 19999,
            image: "https://static.wixstatic.com/media/4594f8_6f9a817c465e44f788aa21307f5057fb~mv2.jpg/v1/fill/w_480,h_638,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4594f8_6f9a817c465e44f788aa21307f5057fb~mv2.jpg",
            category: "Premium",
            occasion: ["Wedding", "Festival"],
            description: "Traditional Paithani silk with vibrant peacock motifs",
            badge: "Premium"
        },
        {
            id: 19,
            name: "Pure Silk Saree with Zari",
            price: 13499,
            originalPrice: 16999,
            image: "https://panjavarnam.com/cdn/shop/files/pink-and-blue-kanchipuram-silk-saree-with-zari-checks-medium-border-handwoven-pure-silk-for-wedding-wear-pv-nyc-1023-silk-sari-panjavarnam-pv-nyc-1023-90035.jpg?v=1742458189",
            category: "Premium",
            occasion: ["Wedding", "Festival"],
            description: "Luxurious pure silk with intricate zari borders",
            badge: "Bestseller"
        },
        {
            id: 35,
            name: "Kanjivaram Pure Silk Saree",
            price: 16999,
            originalPrice: 20999,
            image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
            category: "Premium",
            occasion: ["Wedding", "Formal"],
            description: "Pure Kanjivaram silk with elaborate zari work",
            badge: "Premium"
        },
        {
            id: 36,
            name: "Banarasi Pure Silk Saree",
            price: 14999,
            originalPrice: 18999,
            image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
            category: "Premium",
            occasion: ["Wedding", "Festival"],
            description: "Rich Banarasi silk with traditional brocade patterns",
            badge: "Trending"
        },
        {
            id: 37,
            name: "Ikkat Silk Saree",
            price: 12999,
            originalPrice: 15999,
            image: "https://encrypted-tbn0.gstatic.com/images?q=0GcT3k6bIkAJ0cvAhYggp3yg8KHM1BhhZyD5j1w&s",
            category: "Premium",
            occasion: ["Festival", "Formal"],
            description: "Handwoven Ikkat silk with unique geometric designs",
            badge: "New"
        },
        {
            id: 38,
            name: "Patan Patola Saree",
            price: 17999,
            originalPrice: 22999,
            image: "https://www.theweavesart.com/cdn/shop/files/PatanPatolaSingleIkatSilkSaree_800x.png?v=1685019509",
            category: "Premium",
            occasion: ["Wedding", "Festival"],
            description: "Exquisite double Ikkat Patola silk saree",
            badge: "Premium"
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
        <div className="min-h-screen bg-[#FFF8E1]">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`md:w-1/4 ${filterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} md:block`}>
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-[#2E2E2E]">Filters</h2>
                                <div className="flex items-center">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#6B2D2D] hover:text-[#3A1A1A] mr-4"
                                    >
                                        Clear All
                                    </button>
                                    {filterOpen && (
                                        <button
                                            onClick={toggleFilter}
                                            className="md:hidden text-[#2E2E2E] hover:text-[#3A1A1A]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((category, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                                                checked={selectedFilters.category.includes(category)}
                                                onChange={() => handleFilterChange('category', category)}
                                            />
                                            <span className="ml-3 text-[#2E2E2E]">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {prices.map((price, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                                                checked={selectedFilters.price.includes(price.value)}
                                                onChange={() => handleFilterChange('price', price.value)}
                                            />
                                            <span className="ml-3 text-[#2E2E2E]">{price.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Occasion Filter */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-[#2E2E2E] mb-3">Occasion</h3>
                                <div className="space-y-2">
                                    {occasions.map((occasion, index) => (
                                        <label key={index} className="flex items-center py-1">
                                            <input
                                                type="checkbox"
                                                className="rounded text-[#6B2D2D] focus:ring-[#6B2D2D]"
                                                checked={selectedFilters.occasion.includes(occasion)}
                                                onChange={() => handleFilterChange('occasion', occasion)}
                                            />
                                            <span className="ml-3 text-[#2E2E2E]">{occasion}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="md:w-3/4">
                        {/* Mobile Filter Toggle and Results Count */}
                        <div className="flex justify-between items-center mb-8">
                            <button
                                onClick={toggleFilter}
                                className="md:hidden flex items-center bg-white px-4 py-2 rounded-lg shadow-sm text-[#6B2D2D] font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </button>
                            <div className="text-[#2E2E2E]">
                                Showing {currentProducts.length} of {filteredProducts.length} products
                            </div>
                        </div>

                        {/* Products Grid */}
                        {currentProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl group border border-[#D9A7A7]">
                                        <div className="relative overflow-hidden">
                                            {product.badge && (
                                                <span className="absolute top-4 left-4 bg-[#6B2D2D] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
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
                                            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#D9A7A7]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6B2D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2 group-hover:text-[#3A1A1A] transition-colors duration-300">{product.name}</h3>
                                            <p className="text-[#2E2E2E] text-sm mb-3 line-clamp-2">{product.description}</p>

                                            <div className="flex items-center mt-2 mb-3">
                                                <span className="text-[#6B2D2D] font-bold text-lg">{formatPrice(product.price)}</span>
                                                {product.originalPrice && (
                                                    <span className="text-[#2E2E2E] text-sm line-through ml-2">{formatPrice(product.originalPrice)}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex">
                                                    {/* Removed color swatches */}
                                                </div>
                                                <Link to="/viewdetails">
                                                    <button className="bg-[#6B2D2D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6B2D2D] hover:text-white transition-all duration-300">
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#2E2E2E] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-[#2E2E2E] mb-2">No products found</h3>
                                <p className="text-[#2E2E2E]">Try adjusting your filters to find what you're looking for.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 bg-[#6B2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#3A1A1A] transition-colors"
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
                                        className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button 
                                            key={page}
                                            onClick={() => paginate(page)}
                                            className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-[#6B2D2D] text-white' : 'text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border text-[#2E2E2E] hover:bg-[#D9A7A7] hover:text-[#3A1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;