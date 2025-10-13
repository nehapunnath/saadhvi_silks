// src/pages/admin/Orders.js
import React, { useState } from 'react';
import Sidebar from '../../Components/SideBar';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 9876543210'
      },
      products: [
        {
          id: 1,
          name: 'Kanjivaram Silk Saree',
          price: 12499,
          quantity: 1,
          image: 'https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124'
        }
      ],
      totalAmount: 13498,
      status: 'Delivered',
      paymentStatus: 'Paid',
      orderDate: '2024-03-15',
      deliveryDate: '2024-03-20',
      shippingAddress: {
        name: 'Priya Sharma',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Anita Patel',
        email: 'anita.patel@email.com',
        phone: '+91 9876543211'
      },
      products: [
        {
          id: 2,
          name: 'Banarasi Silk Saree',
          price: 9999,
          quantity: 1,
          image: 'https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg'
        },
        {
          id: 4,
          name: 'Tussar Silk Saree',
          price: 6299,
          quantity: 1,
          image: 'https://oldsilksareebuyers.com/wp-content/uploads/2021/04/Old-Wedding-pattu-saree-buyers-1.jpg'
        }
      ],
      totalAmount: 17297,
      status: 'Shipped',
      paymentStatus: 'Paid',
      orderDate: '2024-03-18',
      deliveryDate: '2024-03-25',
      shippingAddress: {
        name: 'Anita Patel',
        street: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      }
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Sunita Reddy',
        email: 'sunita.reddy@email.com',
        phone: '+91 9876543212'
      },
      products: [
        {
          id: 3,
          name: 'Designer Art Silk Saree',
          price: 7499,
          quantity: 2,
          image: 'https://www.vishalprints.in/cdn/shop/files/STAR_SILK-55337-01.jpg?v=1755161577'
        }
      ],
      totalAmount: 15998,
      status: 'Processing',
      paymentStatus: 'Pending',
      orderDate: '2024-03-20',
      deliveryDate: '2024-03-27',
      shippingAddress: {
        name: 'Sunita Reddy',
        street: '789 Gandhi Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      }
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Meera Kumar',
        email: 'meera.kumar@email.com',
        phone: '+91 9876543213'
      },
      products: [
        {
          id: 1,
          name: 'Kanjivaram Silk Saree',
          price: 12499,
          quantity: 1,
          image: 'https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_580x.jpg?v=1571711124'
        }
      ],
      totalAmount: 13498,
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      orderDate: '2024-03-10',
      deliveryDate: '2024-03-15',
      shippingAddress: {
        name: 'Meera Kumar',
        street: '321 Lake View',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India'
      }
    },
    {
      id: 'ORD-005',
      customer: {
        name: 'Ritu Singh',
        email: 'ritu.singh@email.com',
        phone: '+91 9876543214'
      },
      products: [
        {
          id: 2,
          name: 'Banarasi Silk Saree',
          price: 9999,
          quantity: 1,
          image: 'https://m.media-amazon.com/images/I/9176UCN4piL._UY350_.jpg'
        }
      ],
      totalAmount: 10998,
      status: 'Pending',
      paymentStatus: 'Paid',
      orderDate: '2024-03-22',
      deliveryDate: '2024-03-29',
      shippingAddress: {
        name: 'Ritu Singh',
        street: '654 Hills Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        country: 'India'
      }
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentOptions = ['All', 'Paid', 'Pending', 'Refunded', 'Failed', 'Cancelled'];

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
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'All' || order.paymentStatus === filterPayment;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPayment && matchesSearch;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    ));
  };

  const getOrdersCountByStatus = () => {
    const counts = {
      All: orders.length,
      Pending: orders.filter(order => order.status === 'Pending').length,
      Processing: orders.filter(order => order.status === 'Processing').length,
      Shipped: orders.filter(order => order.status === 'Shipped').length,
      Delivered: orders.filter(order => order.status === 'Delivered').length,
      Cancelled: orders.filter(order => order.status === 'Cancelled').length
    };
    return counts;
  };

  const statusCounts = getOrdersCountByStatus();

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
                  <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
                  <p className="text-gray-600 mt-1">Manage and track customer orders</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Orders</span>
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-orange-600 mt-1">{statusCounts.Pending}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {formatPrice(orders.reduce((total, order) => total + order.totalAmount, 0))}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                      <p className="text-3xl font-bold text-purple-600 mt-1">
                        {formatPrice(orders.reduce((total, order) => total + order.totalAmount, 0) / orders.length)}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>
                            {option} {option !== 'All' && `(${statusCounts[option]})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                      <select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      >
                        {paymentOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="lg:w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#6B2D2D] focus:border-transparent"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {order.products.length} item{order.products.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                              <div className="text-sm text-gray-500">{order.customer.email}</div>
                              <div className="text-xs text-gray-400">{order.customer.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#6B2D2D] ${getStatusColor(order.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                              className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#6B2D2D] ${getPaymentStatusColor(order.paymentStatus)}`}
                            >
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                              <option value="Refunded">Refunded</option>
                              <option value="Failed">Failed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <Link
                                to={`/admin/vieworders`}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View</span>
                              </Link>
                              
                              <button 
                                onClick={() => handleDeleteProduct(order.id)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-4">No orders match your current filters.</p>
                    <button
                      onClick={() => {
                        setFilterStatus('All');
                        setFilterPayment('All');
                        setSearchTerm('');
                      }}
                      className="bg-[#6B2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#8B3A3A] transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-white bg-[#6B2D2D] border border-[#6B2D2D] rounded-lg hover:bg-[#8B3A3A]">
                      1
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;