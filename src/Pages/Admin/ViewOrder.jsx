// src/pages/admin/ViewOrder.js
import React from 'react';
import Sidebar from '../../Components/SideBar';
import { Link, useParams } from 'react-router-dom';

const ViewOrder = () => {
  const { id } = useParams();
  
  // Sample order data - in real app, you'd fetch this by ID
  const order = {
    id: 'ORD-001',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 9876543210',
      joinDate: '2023-05-15',
      totalOrders: 5,
      loyaltyTier: 'Gold'
    },
    products: [
      {
        id: 1,
        name: 'Kanjivaram Silk Saree',
        price: 12499,
        originalPrice: 15999,
        quantity: 1,
        image: 'https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124',
        category: 'Traditional',
        size: 'Standard',
        color: 'Red with Gold Border'
      }
    ],
    totalAmount: 13498,
    subtotal: 12499,
    shipping: 0,
    tax: 999,
    discount: 0,
    status: 'Delivered',
    paymentStatus: 'Paid',
    orderDate: '2024-03-15 14:30:00',
    deliveryDate: '2024-03-20 11:15:00',
    shippingAddress: {
      name: 'Priya Sharma',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      landmark: 'Near City Mall',
      instructions: 'Leave at security desk if not home'
    },
    billingAddress: {
      sameAsShipping: true,
      name: 'Priya Sharma',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    shippingMethod: 'Express Delivery',
    trackingNumber: 'TRK789456123',
    carrier: 'Bluedart',
    estimatedDelivery: '3-5 business days'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDiscount = (originalPrice, price) => {
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                  <p className="text-gray-600 mt-1">Order #{order.id}</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/admin/orders"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Orders</span>
                  </Link>
                  <button className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Overview */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Order Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Order Status</h3>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{new Date(order.orderDate).toLocaleString()}</span>
                      </div>
                      {order.deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Date:</span>
                          <span className="font-medium">{new Date(order.deliveryDate).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Shipping</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{order.shippingMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span className="font-medium">{order.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking:</span>
                        <span className="font-medium text-blue-600">{order.trackingNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items Total:</span>
                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">{formatPrice(order.tax)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-lg font-semibold text-gray-800">Total:</span>
                        <span className="text-lg font-bold text-[#6B2D2D]">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Customer Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-gray-800 font-medium text-lg">{order.customer.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="text-gray-800 font-medium">{order.customer.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <p className="text-gray-800 font-medium">{order.customer.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Customer Since</label>
                        <p className="text-gray-800 font-medium">{new Date(order.customer.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Total Orders</label>
                        <p className="text-gray-800 font-medium">{order.customer.totalOrders}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Loyalty Tier</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {order.customer.loyaltyTier}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{order.shippingAddress.name}</p>
                      <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                    
                    {order.shippingAddress.landmark && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Landmark</label>
                        <p className="text-gray-800">{order.shippingAddress.landmark}</p>
                      </div>
                    )}
                    
                    {order.shippingAddress.instructions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Instructions</label>
                        <p className="text-gray-800 italic">{order.shippingAddress.instructions}</p>
                      </div>
                    )}
                  </div>

                  {/* Billing Address */}
                  {!order.billingAddress.sameAsShipping && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
                      <div className="space-y-2">
                        <p className="text-gray-800 font-medium">{order.billingAddress.name}</p>
                        <p className="text-gray-600">{order.billingAddress.street}</p>
                        <p className="text-gray-600">
                          {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}
                        </p>
                        <p className="text-gray-600">{order.billingAddress.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Order Items</h2>
                <div className="space-y-6">
                  {order.products.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium ml-2">{product.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium ml-2">{product.size}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Color:</span>
                            <span className="font-medium ml-2">{product.color}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium ml-2">{product.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-[#6B2D2D]">
                            {formatPrice(product.price * product.quantity)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice * product.quantity)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-green-600 font-medium">
                            Save {formatPrice((product.originalPrice - product.price) * product.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">Order Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Order Delivered</p>
                      <p className="text-sm text-gray-600">{new Date(order.deliveryDate).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Order Shipped</p>
                      <p className="text-sm text-gray-600">{new Date('2024-03-18 09:30:00').toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Order Processing</p>
                      <p className="text-sm text-gray-600">{new Date('2024-03-16 11:20:00').toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Payment Received</p>
                      <p className="text-sm text-gray-600">{new Date('2024-03-15 14:35:00').toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Order Placed</p>
                      <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  to="/admin/orders"
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Back to Orders
                </Link>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4" />
                  </svg>
                  <span>Export Invoice</span>
                </button>
                <button className="bg-[#6B2D2D] text-white px-8 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;