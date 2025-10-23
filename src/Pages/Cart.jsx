import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authApi from '../Services/authApi';
import qr from '../assets/qr.jpg';
import productApi from '../Services/proApi';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!authApi.isLoggedIn()) {
        toast.error('Please login first to view your cart!');
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const response = await productApi.getCart();
        setCartItems(response.items || []);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  // Handle quantity change
  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await productApi.updateCartQuantity(id, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Quantity updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (id) => {
    try {
      await productApi.removeFromCart(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success('Removed from cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!authApi.isLoggedIn()) {
      toast.error('Please login to place your order!');
      navigate('/login');
      return;
    }
    try {
      // Send order details to backend
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        timestamp: new Date().toISOString(),
      };
      await productApi.placeOrder(orderData);
      setOrderConfirmed(true);
      setCartItems([]); // Clear cart after order
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#800020] text-center mb-12">
          Your Cart
        </h1>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-[#2E2E2E] text-lg">Loading your cart...</p>
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
            <p className="text-[#2E2E2E] mb-4">Thank you for your purchase.</p>
            <div className="bg-gray-200 p-4 rounded-lg inline-block mb-4">
              <div className="w-64 h-64 bg-white flex items-center justify-center mx-auto">
                <img src={qr} alt="QR Code for Payment" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-[#2E2E2E] font-bold text-lg mb-4">
              Please scan the QR code and share the payment screenshot on WhatsApp:
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
            <Link
              to="/products"
              className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-4"
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
          <div className="max-w-lg mx-auto">
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
                onClick={handlePlaceOrder}
                className="w-full bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition-all duration-300 mt-6"
              >
                Place Order
              </button>
              <Link
                to="/products"
                className="block text-center text-[#6B2D2D] font-medium hover:text-[#3A1A1A] transition-colors duration-300 mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;