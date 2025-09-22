import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import qr from '../assets/qr.jpg'

const Cart = () => {
  // Sample cart data (in a real app, this would come from a state management system or context)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Kanjivaram Silk Saree",
      price: 12499,
      image: "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124",
      quantity: 1
    },
    {
      id: 2,
      name: "Banarasi Silk Saree",
      price: 9999,
      image: "https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg",
      quantity: 2
    }
  ]);

  // State for checkout form visibility
  const [showCheckout, setShowCheckout] = useState(false);
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  // State for form errors
  const [errors, setErrors] = useState({});
  // State for order confirmation
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate total (with shipping)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 250; // Free shipping above ₹5000
    return subtotal + shipping;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order confirmation
    setOrderConfirmed(true);
    // Optionally clear cart after confirmation
    // setCartItems([]);
  };

  // Toggle checkout form
  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
    setErrors({}); // Clear errors when toggling
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] text-center mb-12">
          {showCheckout ? 'Checkout' : 'Your Cart'}
        </h1>

        {orderConfirmed ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg p-6">
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
              Thank you for your purchase. You'll receive a confirmation email soon.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#800020] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
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
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items or Checkout Form */}
            <div className="lg:w-2/3">
              {!showCheckout ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center border-b border-[#D9A7A7] py-6 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg mr-6"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2">{item.name}</h3>
                        <div className="flex items-center">
                          <span className="text-[#2E2E2E] mr-2">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
                              aria-label="Decrease quantity"
                              disabled={item.quantity === 1}
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
                                  d="M18 12H6"
                                />
                              </svg>
                            </button>
                            <span className="text-[#2E2E2E] font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
                              aria-label="Increase quantity"
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
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[#6B2D2D] font-bold text-lg mb-2">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[#2E2E2E] hover:text-[#3A1A1A] transition-colors duration-300"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
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
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-[#2E2E2E] mb-6">Shipping Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="md:col-span-2">
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

                  <h2 className="text-xl font-semibold text-[#2E2E2E] mt-8 mb-6">Payment Method</h2>
                  
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => handlePaymentMethodChange('card')}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        paymentMethod === 'card' 
                          ? 'bg-[#6B2D2D] text-white' 
                          : 'bg-gray-200 text-[#2E2E2E] hover:bg-gray-300'
                      }`}
                    >
                      Card Payment
                    </button>
                    <button
                      onClick={() => handlePaymentMethodChange('scanner')}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        paymentMethod === 'scanner' 
                          ? 'bg-[#6B2D2D] text-white' 
                          : 'bg-gray-200 text-[#2E2E2E] hover:bg-gray-300'
                      }`}
                    >
                      QR Scanner
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="cardNumber">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                          aria-label="Card Number"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="expiry">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                          aria-label="Expiry Date"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-[#2E2E2E] font-medium mb-2" htmlFor="cvv">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#D9A7A7] rounded-lg focus:ring-[#6B2D2D] focus:border-[#6B2D2D]"
                          aria-label="CVV"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 border-2 border-dashed border-[#D9A7A7] rounded-lg">
                      <div className="mb-4">
                        {/* <svg
                          className="w-16 h-16 text-[#6B2D2D] mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg> */}
                      </div>
                      <p className="text-[#2E2E2E] mb-4">Scan the QR code to complete your payment</p>
                      <div className="bg-gray-200 p-4 rounded-lg inline-block mb-4">
                        {/* Increased size of QR code */}
                        <div className="w-full h-89 bg-white flex items-center justify-center mx-auto">
                          <img 
                            src={qr} 
                            alt="QR Code for Payment" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <p className="text-[#2E2E2E] font-bold text-lg mb-2">After payment, please share the screenshot on WhatsApp:</p>
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
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
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
                            className="w-6 h-6 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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
                            className="w-6 h-6 flex items-center justify-center bg-[#800020] text-white rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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
                    <span>
                      {calculateSubtotal() > 5000 ? 'Free' : formatPrice(250)}
                    </span>
                  </div>
                  <div className="border-t border-[#D9A7A7] pt-4 flex justify-between font-semibold text-[#2E2E2E]">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                {!showCheckout ? (
                  <button
                    onClick={toggleCheckout}
                    className="w-full bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-6"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-6"
                  >
                    Place Order
                  </button>
                )}
                {showCheckout && (
                  <button
                    onClick={toggleCheckout}
                    className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-4"
                  >
                    Back to Cart
                  </button>
                )}
                <Link
                  to="/products"
                  className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;