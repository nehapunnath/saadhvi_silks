import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Trash2, ArrowLeft, ArrowRight, CreditCard, Truck, ShieldCheck, QrCode, Wallet, MapPin, Phone, Mail, User, Home, Building, Map, CreditCard as PinCode } from 'lucide-react';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import qr from '../assets/qr.jpg';

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    paymentMethod: 'cod',
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* --------------------------------------------------------------- */
  /*  FETCH CART                                                     */
  /* --------------------------------------------------------------- */
  const fetchCart = async () => {
    if (!authApi.isLoggedIn()) {
      setError('Please login to view your cart');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { items = [] } = await productApi.getCart();
      setCartItems(items);

    } catch (err) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* --------------------------------------------------------------- */
  /*  HELPERS                                                        */
  /* --------------------------------------------------------------- */
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  const calculateProductSubtotal = () =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const calculateShipping = () =>
    cartItems.reduce((sum, i) => {
      const shippingPerItem = Number(i.extraCharges || 0);
      return sum + shippingPerItem * i.quantity;
    }, 0);

  const calculateTotal = () => calculateProductSubtotal() + calculateShipping();

  const handleRemoveItem = async (id) => {
    try {
      await productApi.removeFromCart(id);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Something Went Wrong !!!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await productApi.checkout(payload);
      console.log('Checkout response:', response);

      setOrderConfirmed(true);
      setCartItems([]);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Order placement failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCheckout = () => setShowCheckout((p) => !p);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#800020] mx-auto"></div>
            <ShoppingBag className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#800020] w-6 h-6" />
          </div>
          <p className="mt-6 text-[#2E2E2E] font-medium">Loading your precious items...</p>
        </div>
      </div>
    );
  }

  if (error === 'Please login to view your cart') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#800020]" />
            </div>
            <h2 className="text-2xl font-serif text-[#2E2E2E] mb-3">Login Required</h2>
            <p className="text-[#666] mb-8">Please login to view and manage your cart</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              Login Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-[#2E2E2E] mb-3">Error</h2>
            <p className="text-[#666] mb-8">{error}</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-[#800020] text-white px-8 py-3 rounded-full font-medium hover:bg-[#6B001A] transition">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ORDER CONFIRMED SUCCESS PAGE
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#800020] to-[#6B001A] p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-14 h-14 text-[#800020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Order Confirmed!</h2>
              <p className="text-[#F5E6D3]">Thank you for your purchase</p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-[#2E2E2E] mb-2">Your order has been received successfully.</p>
                {/* <p className="text-sm text-[#666]">Order details have been sent to your email</p> */}
              </div>

              <div className="bg-[#F9F3F3] rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <QrCode className="w-6 h-6 text-[#800020]" />
                  <h3 className="font-semibold text-[#2E2E2E]">Payment Instructions</h3>
                </div>
                
                <div className="flex flex-col items-center">
                  {/* <img src={qr} alt="Payment QR" className="w-48 h-48 rounded-2xl shadow-md mb-4" /> */}
                  <p className="text-sm text-[#666] text-center mb-4">
                    Share screenshot on WhatsApp
                  </p>
                  <a
                    href="https://wa.me/918861315710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
                    </svg>
                    Send Screenshot on WhatsApp
                  </a>
                </div>
              </div>

              <Link to="/products" className="block text-center text-[#800020] hover:text-[#6B001A] font-medium transition">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-[#800020]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-[#800020]" />
              </div>
              <h2 className="text-2xl font-serif text-[#2E2E2E] mb-3">Your cart is empty</h2>
              <p className="text-[#666] mb-8">Discover our exquisite collection of handcrafted sarees</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3F3] via-[#F7F0E8] to-[#F5EDE3] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#800020] mb-3">
            {showCheckout ? 'Checkout' : 'Shopping Cart'}
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-[#800020] to-[#D9A7A7] mx-auto"></div>
          <p className="text-[#666] mt-4">
            {showCheckout ? 'Complete your order details' : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {showCheckout ? (
              /* ------------------- CHECKOUT FORM ------------------- */
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#800020] to-[#6B001A] px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#800020] font-bold">2</span>
                    </div>
                    <h2 className="text-2xl font-serif text-white">Shipping & Payment</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#800020]" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#800020]" />
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Address *</label>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">City *</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">State *</label>
                          <div className="relative">
                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#2E2E2E] mb-2">PIN Code *</label>
                          <div className="relative">
                            <PinCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#800020]" />
                      Payment Method
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod'
                          ? 'border-[#800020] bg-[#F9F3F3]'
                          : 'border-gray-200 hover:border-[#D9A7A7]'
                        }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-[#800020] focus:ring-[#800020]"
                        />
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#800020]" />
                            <p className="font-medium text-[#2E2E2E]">Cash on Delivery</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'upi'
                          ? 'border-[#800020] bg-[#F9F3F3]'
                          : 'border-gray-200 hover:border-[#D9A7A7]'
                        }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-[#800020] focus:ring-[#800020]"
                        />
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-[#800020]" />
                            <p className="font-medium text-[#2E2E2E]">UPI / QR Code</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Scan QR & share screenshot</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* UPI QR Section */}
                  {formData.paymentMethod === 'upi' && (
                    <div className="bg-[#F9F3F3] rounded-2xl p-6 text-center border-2 border-dashed border-[#D9A7A7]">
                      <QrCode className="w-12 h-12 text-[#800020] mx-auto mb-4" />
                      <p className="text-[#2E2E2E] font-medium mb-3">Scan to Pay</p>
                      <div className="inline-block p-3 bg-white rounded-2xl shadow-md mb-3">
                         <img src={qr} alt="QR Code" className="w-72 h-72 object-contain" />
                      </div>
                      <p className="text-sm text-[#666]">Share payment screenshot on WhatsApp for order confirmation</p>
                      <a href="https://wa.me/918861315710" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-green-600 font-medium hover:underline">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
                        </svg>
                        WhatsApp Support
                      </a>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={toggleCheckout}
                      className="flex-1 px-6 py-3 border-2 border-[#800020] text-[#800020] rounded-full font-medium hover:bg-[#800020] hover:text-white transition-all duration-300"
                    >
                      ← Back to Cart
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-[#800020] to-[#6B001A] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                    >
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ------------------- CART SUMMARY ------------------- */
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#800020] to-[#6B001A] px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <span className="text-[#800020] font-bold">1</span>
                      </div>
                      <h2 className="text-2xl font-serif text-white">Order Summary</h2>
                    </div>
                    <span className="text-white/80 text-sm">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-[#F9F3F3]/30 transition">
                      <div className="flex gap-5">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          loading="lazy" 
                          decoding="async" 
                          className="w-24 h-24 object-cover rounded-xl shadow-md" 
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2E2E2E] text-lg line-clamp-2">{item.name}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-[#666]">Quantity:</span>
                            <span className="font-medium text-[#800020]">{item.quantity}</span>
                          </div>
                          {item.extraCharges > 0 && (
                            <p className="text-xs text-[#666] mt-1">Shipping: {formatPrice(item.extraCharges)}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#800020] text-xl">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button 
                            onClick={() => handleRemoveItem(item.id)} 
                            className="mt-3 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-[#F9F3F3]">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[#2E2E2E]">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatPrice(calculateProductSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-[#2E2E2E]">
                      <span>Shipping</span>
                      <span className="font-medium">{formatPrice(calculateShipping())}</span>
                    </div>
                    <div className="pt-3 border-t border-[#D9A7A7] flex justify-between text-xl font-bold text-[#800020]">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  <button
                    onClick={toggleCheckout}
                    className="mt-6 w-full bg-gradient-to-r from-[#800020] to-[#6B001A] text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link to="/products" className="block text-center mt-4 text-[#800020] hover:text-[#6B001A] text-sm transition">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary (only in checkout mode) */}
          {showCheckout && (
            <div className="lg:w-96">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
                <h3 className="text-xl font-serif text-[#800020] mb-4">Order Summary</h3>
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#2E2E2E] truncate flex-1">{item.name}</span>
                      <span className="text-[#800020] font-medium ml-2">x{item.quantity}</span>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-xs text-[#666]">+{cartItems.length - 3} more items</p>
                  )}
                </div>
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#666]">Subtotal</span>
                    <span className="text-[#2E2E2E]">{formatPrice(calculateProductSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Shipping</span>
                    <span className="text-[#2E2E2E]">{formatPrice(calculateShipping())}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-bold text-[#2E2E2E]">Total</span>
                    <span className="font-bold text-[#800020] text-lg">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-[#666]">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Secure Checkout</span>
                  </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;