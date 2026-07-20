import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#fff', 
        padding: '20px 30px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: '500', color: '#7f8c8d' }}>Welcome, {userInfo?.name || 'Admin'}</span>
          <button 
            onClick={logoutHandler} 
            style={{ 
              background: '#e74c3c', color: 'white', border: 'none', 
              padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' 
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        <div 
          onClick={() => navigate('/admin/orders')}
          style={{
            background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #3498db',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#2c3e50' }}>📦 Manage Orders</h3>
          <p style={{ color: '#7f8c8d', margin: 0 }}>View, update, and confirm customer orders</p>
        </div>

        <div 
          onClick={() => navigate('/admin/products')}
          style={{
            background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #2ecc71',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <h3 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#2c3e50' }}>🏷️ Manage Products</h3>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Add, edit, or delete store inventory</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;