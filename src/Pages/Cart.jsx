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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 250; // Free shipping above ₹5000
    return subtotal + shipping;
  };

  return (
    <div className="min-h-screen bg-[#F9F1F0] py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E2E2E] text-center mb-12">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
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
              to="/collections"
              className="inline-block bg-[#8B5F65] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A2E59] transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-[#E8B4B8] py-6 last:border-b-0"
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
                            className="w-8 h-8 flex items-center justify-center bg-[#E8B4B8] text-[#8B5F65] rounded-full hover:bg-[#8B5F65] hover:text-white transition-all duration-300"
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
                            className="w-8 h-8 flex items-center justify-center bg-[#E8B4B8] text-[#8B5F65] rounded-full hover:bg-[#8B5F65] hover:text-white transition-all duration-300"
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
                      <span className="text-[#8B5F65] font-bold text-lg mb-2">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#2E2E2E] hover:text-[#4A2E59] transition-colors duration-300"
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
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#2E2E2E] mb-6">Order Summary</h2>
                <div className="space-y-4">
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
                  <div className="border-t border-[#E8B4B8] pt-4 flex justify-between font-semibold text-[#2E2E2E]">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                <button
                  className="w-full bg-[#8B5F65] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A2E59] transition-all duration-300 mt-6"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="block text-center text-[#8B5F65] font-medium hover:text-[#4A2E59] transition-colors duration-300 mt-4"
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