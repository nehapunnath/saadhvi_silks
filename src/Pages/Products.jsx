import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../Services/proApi';
import qr from '../assets/qr.jpg';

const Cart = () => {
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
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState(null); // New state for cart-specific errors

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await productApi.getCart();
        setCartItems(response.items || []);
      } catch (err) {
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = async (id, delta) => {
    try {
      setCartError(null); // Clear previous errors
      const item = cartItems.find((item) => item.id === id);
      const newQuantity = Math.max(1, item.quantity + delta);
      const response = await productApi.updateCartItem(id, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: response.quantity } : item
        )
      );
    } catch (err) {
      setCartError(err.message || 'Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (id) => {
    try {
      setCartError(null);
      await productApi.removeFromCart(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setCartError(err.message || 'Failed to remove item');
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate total (with shipping)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 250;
    return subtotal + shipping;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic form validation
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setCartError(`Please fill in the ${field} field`);
          return;
        }
      }
      // Simulate order placement (extend with API call if needed)
      setOrderConfirmed(true);
    } catch (err) {
      setCartError(err.message || 'Failed to place order');
    }
  };

  // Toggle checkout form
  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
    setCartError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] text-center mb-12">
          {showCheckout ? 'Checkout' : 'Your Cart'}
        </h1>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-[#2E2E2E] text-lg">Loading cart...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 max-w-lg mx-auto">
            <p className="text-[#2E2E2E] text-lg">{error}</p>
            <Link
              to="/products"
              className="inline-block bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-4"
            >
              Shop Now
            </Link>
          </div>
        ) : orderConfirmed ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
            <svg
              className="w-16 h-16 text-[#6B2D2D] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-xl font-medium text-[#2E2E2E] mb-4">Order Confirmed!</h2>
            <p className="text-[#2E2E2E] mb-6">
              Thank you for your purchase. Please share the payment screenshot on WhatsApp.
            </p>
            <a
              href="https://wa.me/918861315710"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-all duration-300 mb-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
              </svg>
              Share on WhatsApp
            </a>
            <Link
              to="/products"
              className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16 max-w-lg mx-auto">
            <svg
              className="w-16 h-16 text-[#2E2E2E] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-medium text-[#2E2E2E] mb-4">Your cart is empty</h2>
            <p className="text-[#2E2E2E] mb-6">
              Explore our collections to find your perfect saree.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              {cartError && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                  {cartError}
                </div>
              )}
              {showCheckout ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-[#2E2E2E] mb-6">Shipping Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="Email"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="address">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="Address"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="City"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="state">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="State"
                      />
                    </div>
                    <div>
                      <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                        aria-label="Postal Code"
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-[#2E2E2E] mt-8 mb-6">Payment</h2>
                  <div className="text-center p-6 border-2 border-dashed border-[#D9A7A7] rounded-lg">
                    <p className="text-[#2E2E2E] mb-4">Scan the QR code to complete your payment</p>
                    <div className="bg-gray-200 p-4 rounded-lg inline-block mb-4">
                      <div className="w-64 h-64 bg-white flex items-center justify-center mx-auto">
                        <img
                          src={qr}
                          alt="QR Code for Payment"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-[#2E2E2E] font-bold text-lg mb-2">
                      After payment, please share the screenshot on WhatsApp:
                    </p>
                    <a
                      href="https://wa.me/918861315710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-all duration-300"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                      </svg>
                      Share on WhatsApp
                    </a>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-6"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={toggleCheckout}
                    className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-4"
                  >
                    Back to Cart
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-[#2E2E2E] mb-6">Order Summary</h2>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center border-b border-[#D9A7A7] py-4 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#2E2E2E] mb-2">{item.name}</h3>
                        <div className="flex items-center">
                          <span className="text-[#2E2E2E] text-sm mr-2">Qty:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition-all duration-300"
                              aria-label="Decrease quantity"
                              disabled={item.quantity === 1}
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18 12H6"
                                />
                              </svg>
                            </button>
                            <span className="text-[#2E2E2E] text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] transition-all duration-300"
                              aria-label="Increase quantity"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[#6B2D2D] font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300 mt-2"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between text-[#2E2E2E]">
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-[#2E2E2E]">
                      <span>Shipping</span>
                      <span>{calculateSubtotal() > 5000 ? 'Free' : formatPrice(250)}</span>
                    </div>
                    <div className="border-t border-[#D9A7A7] pt-4 flex justify-between font-semibold text-[#2E2E2E]">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleCheckout}
                    className="w-full bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-6"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    to="/products"
                    className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;