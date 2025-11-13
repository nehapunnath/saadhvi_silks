// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productApi from '../Services/proApi';
import authApi from '../Services/authApi';
import qr from '../assets/qr.jpg';

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);               // {id, name, price, image, quantity, stock}
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
  const [submitting, setSubmitting] = useState(false);

  /* --------------------------------------------------------------- */
  /*  FETCH CART (with stock)                                        */
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

      // Enrich each item with current stock (API already returns `stock` in cart items)
      // If your backend does **not** send `stock`, you can fetch it separately here.
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

  const calculateSubtotal = () =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + (sub > 5000 ? 0 : 250);
  };

  const canProceedToCheckout = () =>
    cartItems.every((i) => i.quantity <= i.stock);

  /* --------------------------------------------------------------- */
  /*  QUANTITY CHANGE (stock-aware)                                 */
  /* --------------------------------------------------------------- */
  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    // ---- STOCK VALIDATION -------------------------------------------------
    if (newQty > item.stock) {
      toast.error(
        `Only ${item.stock} unit${item.stock > 1 ? 's' : ''} left in stock!`
      );
      return;
    }
    if (newQty < 1) return;

    try {
      await productApi.updateCartItem(id, newQty);
      // Refetch to guarantee server-side consistency
      await fetchCart();
      toast.success('Cart updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await productApi.removeFromCart(id);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  /* --------------------------------------------------------------- */
  /*  CHECKOUT FORM                                                  */
  /* --------------------------------------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canProceedToCheckout()) {
      toast.error('Some items exceed available stock. Please adjust quantities.');
      return;
    }

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
      };
      await productApi.checkout(payload);
      setOrderConfirmed(true);
      setCartItems([]);
    } catch (err) {
      toast.error(err.message || 'Order placement failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCheckout = () => setShowCheckout((p) => !p);

  /* --------------------------------------------------------------- */
  /*  RENDER – LOADING / ERRORS / EMPTY / CONFIRMED                 */
  /* --------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6B2D2D] border-t-transparent mx-auto" />
          <p className="mt-4 text-[#2E2E2E] text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error === 'Please login to view your cart') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
        <div className="container mx-auto px-4 text-center">
          <svg className="w-16 h-16 text-[#6B2D2D] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2E2E2E] mb-4">
            Please login to view your cart
          </h2>
          <p className="text-[#555] mb-8 max-w-md mx-auto">
            Your cart is saved when you're logged in. Sign in to continue shopping.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#6B2D2D] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B3A3A] transition shadow-lg"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
        <div className="container mx-auto px-4 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-medium text-[#2E2E2E] mb-4">{error}</h2>
          <Link
            to="/products"
            className="inline-block bg-[#6B2D2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#8B3A3A] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
        <div className="text-center py-20 bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-4">Order Confirmed!</h2>
          <p className="text-[#555] mb-8 max-w-md mx-auto">
            Thank you for shopping with us. Please share your payment screenshot on WhatsApp to confirm.
          </p>
          <a
            href="https://wa.me/918861315710"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" />
            </svg>
            Share on WhatsApp
          </a>
          <Link to="/products" className="block mt-6 text-[#6B2D2D] font-medium hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12">
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg max-w-2xl mx-auto p-10">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7.48 7h9.02m-9.02 0L5.4 5m1.08 2l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4">Your cart is empty</h2>
          <p className="text-[#555] mb-8">Discover our handcrafted sarees and add your favorites.</p>
          <Link
            to="/products"
            className="inline-block bg-[#6B2D2D] text-white px-8 py-3 rounded-full font-medium hover:bg-[#3A1A1A] transition shadow-md"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- */
  /*  MAIN CART UI                                                   */
  /* --------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F3F3] to-[#F7F0E8] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-[#800020] mb-12">
          {showCheckout ? 'Complete Your Order' : 'Your Shopping Cart'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start">
          {/* ------------------- ORDER SUMMARY / CHECKOUT ------------------- */}
          <div className="w-full lg:w-auto flex-1 max-w-2xl">
            {showCheckout ? (
              /* ------------------- CHECKOUT FORM ------------------- */
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#f0e0e0]">
                <h2 className="text-2xl font-bold text-[#2E2E2E] mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#6B2D2D] text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Shipping & Payment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode'].map((field) => (
                      <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                          {field === 'postalCode' ? 'PIN Code' : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type={field === 'email' ? 'email' : 'text'}
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-[#D9A7A7] rounded-xl focus:ring-2 focus:ring-[#6B2D2D] focus:border-[#6B2D2D] transition"
                          placeholder={field === 'postalCode' ? '400001' : ''}
                        />
                      </div>
                    ))}
                  </div>

                  {/* QR PAYMENT */}
                  <div className="mt-10 p-6 bg-[#fdf4f4] rounded-2xl border-2 border-dashed border-[#D9A7A7] text-center">
                    <p className="text-[#2E2E2E] font-medium mb-4">Scan to Pay</p>
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-md">
                      <img src={qr} alt="QR Code" className="w-56 h-56 object-contain" />
                    </div>
                    <p className="text-sm text-[#555] mt-4">Share payment screenshot on WhatsApp</p>
                    <a
                      href="https://wa.me/918861315710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-green-600 font-medium hover:underline"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488" /></svg>
                      WhatsApp
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !canProceedToCheckout()}
                    className="w-full bg-gradient-to-r from-[#6B2D2D] to-[#800020] text-white py-4 rounded-full font-bold text-lg hover:from-[#3A1A1A] hover:to-[#6B2D2D] transition shadow-lg disabled:opacity-70"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <button
                    type="button"
                    onClick={toggleCheckout}
                    className="w-full text-center text-[#6B2D2D] font-medium hover:underline mt-3"
                  >
                    Back to Cart
                  </button>
                </form>
              </div>
            ) : (
              /* ------------------- CART SUMMARY ------------------- */
              <div className="bg-gradient-to-br from-white to-[#fdf8f5] rounded-3xl shadow-2xl p-8 md:p-10 border border-[#f0e0e0] w-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4a1c1c] flex items-center gap-3">
                    <span className="w-9 h-9 bg-[#6B2D2D] text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Order Summary
                  </h2>
                  <span className="text-sm text-[#666]">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const isOutOfStock = item.stock === 0;
                    const canIncrease = item.quantity < item.stock;

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-5 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition ${isOutOfStock ? 'opacity-60' : ''}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2E2E2E] text-lg line-clamp-2">{item.name}</h3>

                          {/* Stock info */}
                          {item.stock !== undefined && (
                            <p className={`text-xs mt-1 ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.stock > 0
                                ? `${item.stock} left${item.stock <= 5 ? ' – low stock!' : ''}`
                                : 'Out of stock'}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-[#666]">Qty:</span>
                            <div className="flex items-center gap-2 bg-[#f9f3f3] rounded-full p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity === 1}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#800020] text-white hover:bg-[#6B2D2D] transition disabled:opacity-50"
                              >
                                −
                              </button>
                              <span className="w-10 text-center font-medium text-[#2E2E2E]">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={!canIncrease || isOutOfStock}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#800020] text-white hover:bg-[#6B2D2D] transition disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-[#6B2D2D] text-xl">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-3 text-[#999] hover:text-red-600 transition"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* TOTALS */}
                <div className="mt-8 p-6 bg-[#f9f3f3] rounded-2xl space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-[#2E2E2E]">Subtotal</span>
                    <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-[#2E2E2E]">Shipping</span>
                    <span className={calculateSubtotal() > 5000 ? 'text-green-600' : 'font-medium'}>
                      {calculateSubtotal() > 5000 ? 'Free' : formatPrice(250)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-[#e8c6c6] flex justify-between text-xl font-bold text-[#4a1c1c]">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                {/* PROCEED BUTTON */}
                <button
                  onClick={toggleCheckout}
                  disabled={!canProceedToCheckout()}
                  className="mt-8 w-full bg-gradient-to-r from-[#6B2D2D] to-[#800020] text-white py-4 rounded-full font-bold text-lg hover:from-[#3A1A1A] hover:to-[#6B2D2D] transition shadow-xl disabled:opacity-70"
                >
                  {canProceedToCheckout() ? 'Proceed to Checkout' : 'Fix quantities first'}
                </button>

                <Link to="/products" className="block text-center mt-4 text-[#6B2D2D] font-medium hover:underline">
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;