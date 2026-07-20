import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Shipped', 'Delivered'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Updates status optimistically in local state first (so the row updates
  // instantly with no flicker), then confirms with the server. If the
  // request fails, it reverts and alerts the admin.
  const updateStatusHandler = async (id, newStatus) => {
    const previousOrders = orders;
    setUpdatingId(id);
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o)));

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update order status. Reverting.');
      setOrders(previousOrders);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#e74c3c';
      case 'Approved':
        return '#3498db';
      case 'Shipped':
        return '#f39c12';
      case 'Delivered':
        return '#27ae60';
      default:
        return '#e74c3c';
    }
  };

  // Prefer a server-calculated total (which should include delivery fees,
  // discounts, etc.) and only fall back to summing line items if the
  // backend hasn't provided one.
  const getOrderTotal = (order) => {
    if (typeof order.totalPrice === 'number') return order.totalPrice;
    const itemsTotal = order.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
    return itemsTotal;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr.substring(0, 10);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Navigation & Header */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          background: '#f1f5f9',
          color: '#475569',
          border: '1px solid #cbd5e1',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Manage Orders</h2>
          <button
            onClick={fetchOrders}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading orders...</p>
        ) : loadError ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '12px' }}>
              Couldn't load orders. Is the server running?
            </p>
            <button
              onClick={fetchOrders}
              style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 15px', color: '#475569' }}></th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>ID</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Customer</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Phone</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Address</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Date</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Total</th>
                  <th style={{ padding: '12px 15px', color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderTotal = getOrderTotal(order);
                  const currentStatus = order.status || 'Pending';
                  const isExpanded = expandedOrderId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9' }}>
                        <td style={{ padding: '15px 0 15px 15px' }}>
                          <button
                            onClick={() => toggleExpand(order._id)}
                            title="View items"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#64748b',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            ▶
                          </button>
                        </td>
                        <td style={{ padding: '15px', color: '#64748b' }}>{order._id?.substring(0, 8)}...</td>
                        <td style={{ padding: '15px', fontWeight: '500' }}>{order.customerInfo?.name || 'N/A'}</td>
                        <td style={{ padding: '15px' }}>
                          {order.customerInfo?.phone ? (
                            <a href={`tel:${order.customerInfo.phone}`} style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
                              📞 {order.customerInfo.phone}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        {/* FIX: full address now wraps instead of being clipped with ellipsis */}
                        <td style={{ padding: '15px', maxWidth: '240px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {order.customerInfo?.address || 'N/A'}
                        </td>
                        <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{formatDate(order.createdAt)}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>৳{orderTotal.toFixed(2)}</td>
                        <td style={{ padding: '15px' }}>
                          <select
                            value={currentStatus}
                            disabled={updatingId === order._id}
                            onChange={(e) => updateStatusHandler(order._id, e.target.value)}
                            style={{
                              padding: '8px 12px',
                              fontWeight: 'bold',
                              color: 'white',
                              backgroundColor: getStatusColor(currentStatus),
                              border: 'none',
                              borderRadius: '6px',
                              cursor: updatingId === order._id ? 'wait' : 'pointer',
                              outline: 'none',
                              width: '100%',
                              opacity: updatingId === order._id ? 0.6 : 1
                            }}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status} style={{ background: 'white', color: 'black' }}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td colSpan={8} style={{ padding: '0 15px 20px 45px', background: '#f8fafc' }}>
                            {order.customerInfo?.address && (
                              <p style={{ margin: '12px 0', fontSize: '13px', color: '#475569' }}>
                                <strong>Full address:</strong> {order.customerInfo.address}
                              </p>
                            )}
                            {order.orderItems && order.orderItems.length > 0 ? (
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '8px' }}>
                                <thead>
                                  <tr style={{ textAlign: 'left', color: '#64748b' }}>
                                    <th style={{ padding: '6px 10px' }}>Product</th>
                                    <th style={{ padding: '6px 10px' }}>Qty</th>
                                    <th style={{ padding: '6px 10px' }}>Unit Price</th>
                                    <th style={{ padding: '6px 10px' }}>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.orderItems.map((item, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                                      <td style={{ padding: '6px 10px' }}>{item.name || 'Unnamed product'}</td>
                                      <td style={{ padding: '6px 10px' }}>{item.qty}</td>
                                      <td style={{ padding: '6px 10px' }}>৳{Number(item.price).toFixed(2)}</td>
                                      <td style={{ padding: '6px 10px', fontWeight: 'bold' }}>
                                        ৳{(item.price * item.qty).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p style={{ margin: '12px 0', color: '#94a3b8', fontSize: '13px' }}>No item details available.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;