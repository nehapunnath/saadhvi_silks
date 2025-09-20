import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!/^\d{6}$/.test(formData.postalCode)) newErrors.postalCode = 'Postal code must be 6 digits';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!/^\d{16}$/.test(formData.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Invalid expiry format (MM/YY)';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
    <div className="min-h-screen bg-[#FFF8E1] py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E2E2E] text-center mb-12">
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
              className="inline-block bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300"
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
                              className="w-8 h-8 flex items-center justify-center bg-[#D9A7A7] text-[#6B2D2D] rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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
                              className="w-8 h-8 flex items-center justify-center bg-[#D9A7A7] text-[#6B2D2D] rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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
                      {errors.name && <p className="text-[#6B2D2D] text-sm mt-1">{errors.name}</p>}
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
                      {errors.email && <p className="text-[#6B2D2D] text-sm mt-1">{errors.email}</p>}
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
                      {errors.phone && <p className="text-[#6B2D2D] text-sm mt-1">{errors.phone}</p>}
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
                      {errors.address && <p className="text-[#6B2D2D] text-sm mt-1">{errors.address}</p>}
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
                      {errors.city && <p className="text-[#6B2D2D] text-sm mt-1">{errors.city}</p>}
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
                      {errors.state && <p className="text-[#6B2D2D] text-sm mt-1">{errors.state}</p>}
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
                      {errors.postalCode && <p className="text-[#6B2D2D] text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-[#2E2E2E] mt-8 mb-6">Payment Details</h2>
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
                      />
                      {errors.cardNumber && <p className="text-[#6B2D2D] text-sm mt-1">{errors.cardNumber}</p>}
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
                      />
                      {errors.expiry && <p className="text-[#6B2D2D] text-sm mt-1">{errors.expiry}</p>}
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
                      />
                      {errors.cvv && <p className="text-[#6B2D2D] text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
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
                            className="w-6 h-6 flex items-center justify-center bg-[#D9A7A7] text-[#6B2D2D] rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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
                            className="w-6 h-6 flex items-center justify-center bg-[#D9A7A7] text-[#6B2D2D] rounded-full hover:bg-[#6B2D2D] hover:text-white transition-all duration-300"
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