// src/pages/admin/Products.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';
import categoryApi from '../../Services/CategoryApi';
import badgeApi from '../../Services/BadgeApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [showHomepageCount, setShowHomepageCount] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  
  // Budget selection states
  const [budgetSelections, setBudgetSelections] = useState({
    under2000: new Set(),
    mid2000to5000: new Set(),
    mid5000to10000: new Set(),
    premium: new Set()
  });
  const [isSavingBudget, setIsSavingBudget] = useState(false);
  const [activeBudgetTab, setActiveBudgetTab] = useState('under2000');

  // Offer Modal States
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [offerName, setOfferName] = useState('Buy 1 Get 1 Free');
  const [offerPrice, setOfferPrice] = useState('');

  useEffect(() => {
    fetchData();
    loadHomepageSettings();
    loadBudgetSettings();
  }, []);

  const loadHomepageSettings = async () => {
    try {
      const savedSettings = localStorage.getItem('homepage_products');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSelectedProducts(new Set(settings.selectedProductIds || []));
        setShowHomepageCount(settings.count || 3);
      }
    } catch (error) {
      console.error('Error loading homepage settings:', error);
    }
  };

  const loadBudgetSettings = async () => {
    try {
      const savedBudget = localStorage.getItem('budget_selections');
      if (savedBudget) {
        const budget = JSON.parse(savedBudget);
        setBudgetSelections({
          under2000: new Set(budget.under2000 || []),
          mid2000to5000: new Set(budget.mid2000to5000 || []),
          mid5000to10000: new Set(budget.mid5000to10000 || []),
          premium: new Set(budget.premium || [])
        });
      }
    } catch (error) {
      console.error('Error loading budget settings:', error);
    }
  };

  const saveBudgetSettings = async () => {
    setIsSavingBudget(true);
    try {
      const settings = {
        under2000: Array.from(budgetSelections.under2000),
        mid2000to5000: Array.from(budgetSelections.mid2000to5000),
        mid5000to10000: Array.from(budgetSelections.mid5000to10000),
        premium: Array.from(budgetSelections.premium),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('budget_selections', JSON.stringify(settings));
      toast.success('Budget section products saved!');
    } catch (error) {
      toast.error('Failed to save budget settings');
      console.error(error);
    } finally {
      setIsSavingBudget(false);
    }
  };

  const handleBudgetCheckboxChange = (productId, budgetRange, isChecked) => {
    setBudgetSelections(prev => {
      const newSelections = { ...prev };
      
      if (isChecked) {
        // Remove from all other budget ranges first
        Object.keys(newSelections).forEach(range => {
          if (newSelections[range].has(productId)) {
            newSelections[range].delete(productId);
          }
        });
        // Add to selected range
        newSelections[budgetRange].add(productId);
      } else {
        // Remove from the range
        newSelections[budgetRange].delete(productId);
      }
      
      return newSelections;
    });
  };

  const getProductBudgetRange = (productId) => {
    if (budgetSelections.under2000.has(productId)) return 'under2000';
    if (budgetSelections.mid2000to5000.has(productId)) return 'mid2000to5000';
    if (budgetSelections.mid5000to10000.has(productId)) return 'mid5000to10000';
    if (budgetSelections.premium.has(productId)) return 'premium';
    return null;
  };

  const saveHomepageSettings = async () => {
    setIsSaving(true);
    try {
      const settings = {
        selectedProductIds: Array.from(selectedProducts),
        count: showHomepageCount,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('homepage_products', JSON.stringify(settings));
      toast.success(`Selected ${selectedProducts.size} products for homepage!`);
    } catch (error) {
      toast.error('Failed to save homepage settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to normalize categories (convert string to array)
  const normalizeCategories = (categoriesInput) => {
    if (!categoriesInput) return [];
    
    if (Array.isArray(categoriesInput)) {
      return categoriesInput;
    }
    
    if (typeof categoriesInput === 'string') {
      if (categoriesInput.includes(',')) {
        return categoriesInput.split(',').map(id => id.trim());
      } else {
        return [categoriesInput.trim()];
      }
    }
    
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsResult, categoriesResult, badgesResult] = await Promise.all([
        productApi.getProducts(),
        categoryApi.getCategories(),
        badgeApi.getBadges()
      ]);

      let categoriesList = [];
      if (categoriesResult.success) {
        categoriesList = categoriesResult.categories || [];
        console.log('Categories loaded:', categoriesList.length);
      } else {
        console.error('Failed to load categories:', categoriesResult.error);
      }
      
      setCategories(categoriesList);

      const allProducts = productsResult.products || [];
      
      const normalizedProducts = allProducts.map(product => {
        const normalizedProduct = { ...product };
        
        let normalizedCategories = [];
        
        if (product.categories) {
          normalizedCategories = normalizeCategories(product.categories);
        } else if (product.category) {
          normalizedCategories = normalizeCategories(product.category);
        }
        
        if (normalizedCategories.length === 1 && typeof normalizedCategories[0] === 'string' && normalizedCategories[0].includes(',')) {
          normalizedCategories = normalizedCategories[0].split(',').map(id => id.trim());
        }
        
        normalizedCategories = normalizedCategories.filter(id => id && id.trim());
        
        normalizedProduct.categories = normalizedCategories;
        return normalizedProduct;
      });
      
      const sortedProducts = [...normalizedProducts].sort((a, b) => {
        const aVisible = a.isVisible !== false;
        const bVisible = b.isVisible !== false;
        
        if (aVisible && !bVisible) return -1;
        if (!aVisible && bVisible) return 1;
        
        if (aVisible && bVisible) {
          const aOrder = a.displayOrder ?? 999999;
          const bOrder = b.displayOrder ?? 999999;
          return aOrder - bOrder;
        }
        
        const aTime = a.createdAt || a.key || 0;
        const bTime = b.createdAt || b.key || 0;
        return bTime - aTime;
      });

      setProducts(sortedProducts);
      setBadges(badgesResult.badges || []);
      
      toast.success(`Loaded ${productsResult.products?.length || 0} products`);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const visibleProducts = filteredProducts.filter(p => p.isVisible !== false);
    if (selectedProducts.size === visibleProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(visibleProducts.map(p => p.key)));
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts(new Set());
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    
    let cleanId = String(categoryId).trim();
    
    if (cleanId.includes(',')) {
      cleanId = cleanId.split(',')[0].trim();
    }
    
    const category = categories.find(c => String(c.id) === cleanId);
    
    if (category) {
      return category.name;
    }
    
    return cleanId.substring(0, 8);
  };

  const getBadgeName = (badgeId) => {
    if (!badgeId) return null;
    const badge = badges.find(b => b.id === badgeId);
    return badge ? badge.name : 'N/A';
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.key !== id));
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  const handleStockChange = async (productId, status) => {
    try {
      const newStock = status === 'Available' ? 1 : 0;
      await productApi.updateStock(productId, newStock);

      setProducts(prev =>
        prev.map(p =>
          p.key === productId ? { ...p, stock: newStock } : p
        )
      );

      toast.success(`Stock updated to ${status}!`);
    } catch (error) {
      toast.error('Failed to update stock: ' + error.message);
    }
  };

  const moveProduct = async (productId, direction) => {
    setProducts((currentProducts) => {
      const visibleProducts = currentProducts
        .filter(p => p.isVisible !== false)
        .map(p => ({ ...p }));

      const currentIndex = visibleProducts.findIndex(p => p.key === productId);
      if (currentIndex === -1) return currentProducts;

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (swapIndex < 0 || swapIndex >= visibleProducts.length) {
        return currentProducts;
      }

      const reorderedVisible = [...visibleProducts];
      [reorderedVisible[currentIndex], reorderedVisible[swapIndex]] = 
        [reorderedVisible[swapIndex], reorderedVisible[currentIndex]];

      const orderMap = {};
      reorderedVisible.forEach((p, idx) => {
        orderMap[p.key] = idx + 1;
        p.displayOrder = idx + 1;
      });

      const newProducts = currentProducts.map(p => {
        if (p.isVisible !== false) {
          const updated = reorderedVisible.find(r => r.key === p.key);
          return updated ? { ...updated } : p;
        }
        return p;
      });

      newProducts.sort((a, b) => {
        const aVis = a.isVisible !== false;
        const bVis = b.isVisible !== false;

        if (aVis !== bVis) return aVis ? -1 : 1;

        if (aVis) {
          const aOrder = a.displayOrder ?? 999999;
          const bOrder = b.displayOrder ?? 999999;
          return aOrder - bOrder;
        }

        const aTime = a.createdAt || a.key || 0;
        const bTime = b.createdAt || b.key || 0;
        return bTime - aTime;
      });

      productApi.reorderProducts(orderMap)
        .then(() => {
          toast.success('Order saved');
        })
        .catch(err => {
          toast.error('Failed to save order');
          console.error(err);
          fetchData();
        });

      return newProducts;
    });
  };

  const openOfferModal = (productId, currentOffer = null) => {
    setSelectedProductId(productId);
    setOfferName(currentOffer?.offerName || 'Buy 1 Get 1 Free');
    setOfferPrice(currentOffer?.offerPrice ? currentOffer.offerPrice.toString() : '');
    setOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setOfferModalOpen(false);
    setSelectedProductId(null);
    setOfferName('Buy 1 Get 1 Free');
    setOfferPrice('');
  };

  const handleSaveOffer = async () => {
    if (!offerPrice || isNaN(offerPrice) || Number(offerPrice) <= 0) {
      toast.error('Please enter a valid offer price');
      return;
    }

    try {
      const offerData = {
        hasOffer: true,
        offerName: offerName.trim() || 'Buy 1 Get 1 Free',
        offerPrice: Number(offerPrice)
      };

      await productApi.updateProductOffer(selectedProductId, offerData);

      setProducts(prev =>
        prev.map(p =>
          p.key === selectedProductId ? { ...p, ...offerData } : p
        )
      );

      toast.success('Offer applied successfully!');
      closeOfferModal();
    } catch (error) {
      toast.error('Failed to apply offer: ' + error.message);
    }
  };

  const handleRemoveOffer = async (productId) => {
    if (!window.confirm('Remove offer from this product?')) return;

    try {
      await productApi.updateProductOffer(productId, {
        hasOffer: false,
        offerName: null,
        offerPrice: null
      });

      setProducts(prev =>
        prev.map(p =>
          p.key === productId ? { ...p, hasOffer: false, offerName: null, offerPrice: null } : p
        )
      );

      toast.success('Offer removed');
    } catch (error) {
      toast.error('Failed to remove offer');
    }
  };

  const handleVisibilityToggle = async (product) => {
    const current = product.isVisible !== false;
    const next = !current;

    try {
      await productApi.toggleProductVisibility(product.key, next);

      const updatedProducts = products.map(p =>
        p.key === product.key ? { ...p, isVisible: next } : p
      );

      const resortedProducts = [...updatedProducts].sort((a, b) => {
        const aVisible = a.isVisible !== false;
        const bVisible = b.isVisible !== false;
        
        if (aVisible && !bVisible) return -1;
        if (!aVisible && bVisible) return 1;
        
        if (aVisible && bVisible) {
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        }
        
        return 0;
      });

      setProducts(resortedProducts);
      toast.success(`Product is now ${next ? 'visible' : 'hidden'}`);
    } catch (err) {
      toast.error('Failed to change visibility');
      console.error(err);
    }
  };

  const filteredProducts = products.filter(product => {
    let matchesCategory = filterCategory === 'All';
    if (!matchesCategory && product.categories && product.categories.length > 0) {
      matchesCategory = product.categories.includes(filterCategory);
    }
    
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = showHidden ? true : product.isVisible !== false;
    
    return matchesCategory && matchesSearch && matchesVisibility;
  });

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const budgetRanges = [
    { id: 'under2000', label: 'Under ₹2,000', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', count: budgetSelections.under2000.size },
    { id: 'mid2000to5000', label: '₹2,000 - ₹5,000', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', count: budgetSelections.mid2000to5000.size },
    { id: 'mid5000to10000', label: '₹5,000 - ₹10,000', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700', count: budgetSelections.mid5000to10000.size },
    { id: 'premium', label: 'Premium (Above ₹10,000)',  color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700', count: budgetSelections.premium.size }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B2D2D]"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">

              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
                  <p className="text-gray-600 mt-1">Manage your product inventory and listings</p>
                </div>
                <Link
                  to="/admin/addproducts"
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Product</span>
                </Link>
              </div>

              {/* Budget Wise Collection Panel - Checkbox/Toggle Design */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">🎯 Budget Wise Collection</h2>
                      <p className="text-white/80 text-sm mt-1">Select which budget section each product belongs to</p>
                    </div>
                    <button
                      onClick={saveBudgetSettings}
                      disabled={isSavingBudget}
                      className="px-6 py-2 bg-white text-[#2E7D32] rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSavingBudget ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Save Budget Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Budget Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                  {budgetRanges.map((range) => (
                    <div
                      key={range.id}
                      onClick={() => setActiveBudgetTab(range.id)}
                      className={`${range.bgColor} ${range.borderColor} border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${activeBudgetTab === range.id ? 'ring-2 ring-offset-2 ring-' + range.color + '-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        {/* <div className="text-2xl">{range.icon}</div> */}
                        <div className={`text-2xl font-bold ${range.textColor}`}>{range.count}</div>
                      </div>
                      <div className={`text-sm font-medium mt-2 ${range.textColor}`}>{range.label}</div>
                      <div className="text-xs text-gray-500 mt-1">Products assigned</div>
                    </div>
                  ))}
                </div>

                {/* Active Budget Section Products Table */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    {/* <span>{budgetRanges.find(r => r.id === activeBudgetTab)?.icon}</span> */}
                    <span>{budgetRanges.find(r => r.id === activeBudgetTab)?.label}</span>
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({budgetSelections[activeBudgetTab].size} products selected)
                    </span>
                  </h3>
                  
                  {budgetSelections[activeBudgetTab].size === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      {/* <div className="text-5xl mb-3">📦</div> */}
                      <p className="text-gray-500">No products assigned to this budget range yet</p>
                      <p className="text-sm text-gray-400 mt-1">Use the checkboxes below to assign products</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                      {products
                        .filter(p => budgetSelections[activeBudgetTab].has(p.key) && p.isVisible !== false)
                        .map((product) => (
                          <div key={product.key} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
                              alt={product.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                              <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h4>
                              <p className="text-[#800020] font-bold mt-1">{formatPrice(product.price)}</p>
                              <button
                                onClick={() => handleBudgetCheckboxChange(product.key, activeBudgetTab, false)}
                                className="mt-2 w-full px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Homepage Selection Panel */}
              <div className="bg-gradient-to-r from-[#6B2D2D] to-[#8B3A3A] rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">🏠 Homepage Latest Collection</h2>
                    <p className="text-white/80 text-sm">
                      Select products to showcase in the "Latest Collection" section on the homepage
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <span className="text-2xl font-bold">{selectedProducts.size}</span>
                      <span className="ml-1 text-sm">selected</span>
                    </div>
                    <button
                      onClick={handleClearSelection}
                      className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={saveHomepageSettings}
                      disabled={isSaving}
                      className="px-6 py-2 bg-white text-[#6B2D2D] rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save to Homepage'}
                    </button>
                  </div>
                </div>
                
                {/* Display count selector */}
                <div className="mt-4 flex items-center gap-4">
                  <label className="text-sm">Show on homepage:</label>
                  <select
                    value={showHomepageCount}
                    onChange={(e) => setShowHomepageCount(Number(e.target.value))}
                    className="px-3 py-1 rounded-lg text-gray-800 bg-white"
                  >
                    <option value={2}>2 Products</option>
                    <option value={3}>3 Products</option>
                    <option value={4}>4 Products</option>
                    <option value={6}>6 Products</option>
                  </select>
                  <p className="text-xs text-white/70">
                    First {showHomepageCount} selected products will appear (ordered by display order)
                  </p>
                </div>
              </div>

              {/* Search + Stats + Category Filter */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
                      <p className="text-3xl font-bold text-[#6B2D2D] mt-1">{products.length}</p>
                    </div>
                    <div className="flex space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Visible</p>
                        <p className="text-xl font-semibold text-green-600">
                          {products.filter(p => p.isVisible !== false).length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Hidden</p>
                        <p className="text-xl font-semibold text-gray-500">
                          {products.filter(p => p.isVisible === false).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                  >
                    <option value="All">All Categories</option>
                    {categories
                      .filter(cat => cat.isActive !== false)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHidden}
                      onChange={(e) => setShowHidden(e.target.checked)}
                      className="w-5 h-5 text-[#6B2D2D] border-gray-300 rounded focus:ring-[#6B2D2D]"
                    />
                    <span className="text-gray-700 font-medium">Show hidden products</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {products.filter(p => p.isVisible === false).length} hidden
                    </span>
                  </label>
                </div>
              </div>

              {/* Products Table with Budget Checkboxes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest <br />Section</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Section</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product, index) => {
                        const isVisible = product.isVisible !== false;
                        const visibleIndex = products
                          .filter(p => p.isVisible !== false)
                          .findIndex(p => p.key === product.key);
                        const isSelected = selectedProducts.has(product.key);
                        const currentBudgetRange = getProductBudgetRange(product.key);
                        
                        return (
                          <tr key={product.key} className={`hover:bg-gray-50 ${!isVisible ? 'bg-gray-50 opacity-75' : ''} ${isSelected ? 'bg-green-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isVisible && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectProduct(product.key)}
                                  className="w-5 h-5 text-[#6B2D2D] border-gray-300 rounded focus:ring-[#6B2D2D]"
                                />
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isVisible && (
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                  {budgetRanges.map((range) => (
                                    <label key={range.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                                      <input
                                        type="radio"
                                        name={`budget_${product.key}`}
                                        checked={currentBudgetRange === range.id}
                                        onChange={() => handleBudgetCheckboxChange(product.key, range.id, true)}
                                        className={`w-3.5 h-3.5 accent-${range.color}-600`}
                                      />
                                      <span className="text-gray-700"> {range.label}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isVisible ? (
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${isSelected ? 'bg-green-600 text-white' : 'bg-[#6B2D2D] text-white'}`}>
                                    {visibleIndex + 1}
                                  </span>
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => moveProduct(product.key, 'up')}
                                      disabled={visibleIndex === 0}
                                      className={`p-1 rounded ${visibleIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#6B2D2D] hover:bg-gray-100'}`}
                                      title="Move Up"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => moveProduct(product.key, 'down')}
                                      disabled={visibleIndex === products.filter(p => p.isVisible !== false).length - 1}
                                      className={`p-1 rounded ${visibleIndex === products.filter(p => p.isVisible !== false).length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-[#6B2D2D] hover:bg-gray-100'}`}
                                      title="Move Down"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <span className="bg-gray-400 text-white text-sm font-medium px-3 py-1 rounded-full">
                                  Hidden
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.images?.[0] || 'https://via.placeholder.com/48?text=No+Image'}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg mr-4"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {product.name}
                                    {isSelected && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Homepage
                                      </span>
                                    )}
                                    {currentBudgetRange && (
                                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        currentBudgetRange === 'under2000' ? 'bg-blue-100 text-blue-800' :
                                        currentBudgetRange === 'mid2000to5000' ? 'bg-green-100 text-green-800' :
                                        currentBudgetRange === 'mid5000to10000' ? 'bg-orange-100 text-orange-800' :
                                        'bg-purple-100 text-purple-800'
                                      }`}>
                                        {budgetRanges.find(r => r.id === currentBudgetRange)?.icon} {budgetRanges.find(r => r.id === currentBudgetRange)?.label}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description?.substring(0, 30)}{product.description?.length > 30 ? '...' : ''}
                                  </div>

                                  {product.badge && (
                                    <span className="inline-block bg-[#800020] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                                      {getBadgeName(product.badge) || product.badge}
                                    </span>
                                  )}
                                  
                                  {!isVisible && (
                                    <span className="inline-block bg-gray-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ml-1">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {product.categories && product.categories.length > 0 ? (
                                  product.categories.map((categoryId, idx) => {
                                    const categoryName = getCategoryName(categoryId);
                                    return (
                                      <span
                                        key={idx}
                                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap"
                                      >
                                        {categoryName}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                                    No Category
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              <div>
                                <div>{formatPrice(product.price)}</div>
                                {product.originalPrice && (
                                  <div className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => {
                                    if (product.hasOffer) {
                                      handleRemoveOffer(product.key);
                                    } else {
                                      openOfferModal(product.key, {
                                        offerName: product.offerName,
                                        offerPrice: product.offerPrice
                                      });
                                    }
                                  }}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B2D2D] focus:ring-offset-2 ${
                                    product.hasOffer ? 'bg-[#6B2D2D]' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      product.hasOffer ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>

                                {product.hasOffer && (
                                  <div className="text-sm">
                                    <div className="font-bold text-green-600">
                                      {formatPrice(product.offerPrice)}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate max-w-[140px]">
                                      {product.offerName}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={product.stock > 0 ? 'Available' : 'Out of Stock'}
                                onChange={(e) => handleStockChange(product.key, e.target.value)}
                                className="px-3 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-[#6B2D2D]"
                                style={{
                                  backgroundColor: product.stock > 0 ? '#dcfce7' : '#fecaca',
                                  color: product.stock > 0 ? '#166534' : '#991b1b'
                                }}
                              >
                                <option value="Available">Available</option>
                                <option value="Out of Stock">Out of Stock</option>
                              </select>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex flex-wrap gap-3">
                                <Link
                                  to={`/admin/viewproducts/${product.key}`}
                                  className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>View</span>
                                </Link>

                                <Link
                                  to={`/admin/editproducts/${product.key}`}
                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Edit</span>
                                </Link>

                                <button
                                  onClick={() => handleDeleteProduct(product.key)}
                                  className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Delete</span>
                                </button>

                                <button
                                  onClick={() => handleVisibilityToggle(product)}
                                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                    isVisible
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                                >
                                  {isVisible ? 'Hide' : 'Show'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory !== 'All'
                        ? 'Try adjusting your search or filter.'
                        : 'Get started by adding your first product.'}
                    </p>
                    <Link
                      to="/admin/addproducts"
                      className="mt-4 inline-flex items-center px-6 py-3 bg-[#6B2D2D] text-white rounded-lg hover:bg-[#8B3A3A]"
                    >
                      Add Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Modal */}
        {offerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Product Offer</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Name</label>
                  <input
                    type="text"
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    placeholder="e.g. Buy 1 Get 1 Free"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Enter discounted price"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B2D2D]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={closeOfferModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOffer}
                  className="px-6 py-2 bg-[#6B2D2D] text-white rounded-lg hover:bg-[#8B3A3A] transition"
                >
                  Apply Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;