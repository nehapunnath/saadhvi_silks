import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../Components/SideBar';
import productApi from '../../Services/proApi';

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await productApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      Delivered: 'bg-green-100 text-green-800',
      Shipped: 'bg-blue-100 text-blue-800',
      Processing: 'bg-yellow-100 text-yellow-800',
      Pending: 'bg-orange-100 text-orange-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6B2D2D] border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto text-center py-20">
            <p className="text-red-600 text-lg">{error || 'Order not found'}</p>
            <Link to="/admin/orders" className="mt-4 inline-block bg-[#6B2D2D] text-white px-6 py-3 rounded-lg">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safely destructure with fallbacks
  const {
    contact = {},
    items = [],
    total = 0,
    status = 'Pending',
    paymentStatus = 'Pending',
    createdAt,
    shippingAddress = {},
  } = order;

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
  const shippingFee = total - subtotal;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                <p className="text-gray-600 mt-1">Order #{id}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/admin/orders"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Link>
                {/* <button
                  onClick={() => window.print()}
                  className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Print
                </button> */}
              </div>
            </div>

            {/* Status & Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Status</h3>
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                      {paymentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Ordered on {createdAt ? new Date(createdAt).toLocaleString('en-IN') : 'N/A'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer</h3>
                  <p className="font-medium text-gray-900">{contact.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{contact.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{contact.phone || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Total Amount</h3>
                  <p className="text-2xl font-bold text-[#6B2D2D]">{formatPrice(total)}</p>
                  <p className="text-sm text-gray-600">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                {shippingAddress.address ? (
                  <div className="space-y-1 text-gray-700">
                    <p className="font-medium">{contact.name || 'N/A'}</p>
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}{shippingAddress.city && ', '}
                      {shippingAddress.state} {shippingAddress.postalCode}
                    </p>
                    {/* <p>India</p> */}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No shipping address found</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Breakdown</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#6B2D2D]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
              {items.length > 0 ? (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm bg-gray-200"
                        onError={(e) => (e.target.src = '/placeholder.jpg')}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name || 'Unknown Item'}</h3>
                        <div className="flex gap-6 mt-2 text-sm text-gray-600">
                          <span>Qty: {item.quantity || 1}</span>
                          <span>₹{(item.price || 0).toLocaleString('en-IN')} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#6B2D2D]">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No items in this order</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;