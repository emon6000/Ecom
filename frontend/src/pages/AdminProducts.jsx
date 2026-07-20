import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminProducts.css';

const AdminProducts = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true); 
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
      setImages(data);
      setUploading(false); 
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed. Check console.');
      setUploading(false); 
    }
  };

  const handleEditClick = (product) => {
    setEditMode(true);
    setEditProductId(product._id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description);
    setCountInStock(product.countInStock || 0);
    setDiscount(product.discount || 0);
    setVideoLink(product.videoLink || '');
    setImages(product.images || []);
    setIsHidden(product.isHidden || false); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditProductId(null);
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImages([]);
    setVideoLink('');
    setCountInStock(0);
    setDiscount(0);
    setIsHidden(false); 
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const productData = {
        name, price: Number(price), category, description, images, videoLink,
        countInStock: Number(countInStock), discount: Number(discount), isHidden,
      };

      if (editMode) {
        await axios.put(`http://localhost:5000/api/products/${editProductId}`, productData, config);
        setMessage('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', productData, config);
        setMessage('Product added successfully!');
      }

      clearForm();
      setEditMode(false);
      setEditProductId(null);
      fetchProducts();
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save product');
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts(); 
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // Reusable input style
  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '5px', 
    border: '1px solid #ddd', marginTop: '5px', boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Navigation */}
      <button 
        onClick={() => navigate('/admin')}
        style={{ 
          background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', 
          padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', 
          fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Form Card */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
          {editMode ? '✏️ Edit Product' : '➕ Add New Product'}
        </h3>
        
        {message && (
          <div style={{ 
            padding: '12px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold',
            background: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={submitHandler}>
          {/* 2-Column Grid Layout for Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Price (৳)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Stock Quantity</label>
              <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Discount (%)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', color: '#333' }}>Video Link (Optional)</label>
              <input type="text" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Full Width Elements */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontWeight: 'bold', color: '#333' }}>Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} required></textarea>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '5px', border: '1px dashed #cbd5e1' }}>
            <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '10px' }}>Upload Images (Up to 5)</label>
            <input type="file" multiple onChange={uploadFileHandler} />
            {uploading && <span style={{ marginLeft: '10px', color: '#3498db' }}>Uploading to Cloudinary...</span>}
            {images.length > 0 && <div style={{ marginTop: '10px', color: '#27ae60', fontWeight: 'bold' }}>✓ {images.length} image(s) ready.</div>}
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#e74c3c', fontWeight: 'bold' }}>
              <input type="checkbox" checked={isHidden} onChange={(e) => setIsHidden(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              Hide this product from the public store
            </label>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button 
              type="submit" 
              disabled={loading || uploading}
              style={{ 
                flex: 1, background: '#2ecc71', color: 'white', padding: '12px', border: 'none', 
                borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: (loading || uploading) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : uploading ? 'Uploading...' : editMode ? 'Update Product' : 'Add Product'}
            </button>
            
            {editMode && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{ flex: 1, background: '#7f8c8d', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Inventory Table Card */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>Current Inventory</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', color: '#475569' }}>Name</th>
                <th style={{ padding: '12px', color: '#475569' }}>Price</th>
                <th style={{ padding: '12px', color: '#475569' }}>Stock</th>
                <th style={{ padding: '12px', color: '#475569' }}>Status</th>
                <th style={{ padding: '12px', color: '#475569' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9', opacity: product.isHidden ? 0.6 : 1 }}>
                  <td style={{ padding: '15px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '15px' }}>৳{product.price}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      background: product.countInStock > 0 ? '#d1fae5' : '#fee2e2', 
                      color: product.countInStock > 0 ? '#065f46' : '#991b1b',
                      padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' 
                    }}>
                      {product.countInStock || 0}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {product.isHidden ? (
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Hidden</span>
                    ) : (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Visible</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEditClick(product)}
                      style={{ background: '#f39c12', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteHandler(product._id)}
                      style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;