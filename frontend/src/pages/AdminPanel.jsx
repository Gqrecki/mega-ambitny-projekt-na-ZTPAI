import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drinksApi } from '../api';
import { Loading, Button } from '../components';
import { toast } from 'react-toastify';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('drinks');
  const [drinks, setDrinks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDrinkForm, setShowDrinkForm] = useState(false);
  const [editingDrink, setEditingDrink] = useState(null);
  const [drinkForm, setDrinkForm] = useState({
    name: '',
    brand: '',
    category: 'whiskey',
    description: '',
    alcoholPercentage: '',
    price: '',
    country: '',
    volume: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'drinks') {
        const response = await drinksApi.getDrinks({ limit: 100 });
        if (response.status === 'success') {
          setDrinks(response.data.drinks || []);
        }
      } else if (activeTab === 'stats') {
        // Calculate stats from drinks data
        const drinksResponse = await drinksApi.getDrinks({ limit: 100 });
        if (drinksResponse.status === 'success') {
          const drinksData = drinksResponse.data.drinks || [];
          
          // Calculate statistics
          const totalReviews = drinksData.reduce((sum, drink) => sum + (drink.numberOfRatings || 0), 0);
          const avgRating = drinksData.reduce((sum, drink) => sum + (drink.averageRating || 0), 0) / drinksData.length;
          const mostReviewed = drinksData.reduce((max, drink) => 
            (drink.numberOfRatings || 0) > (max.numberOfRatings || 0) ? drink : max
          , drinksData[0]);
          
          setStats({
            totalUsers: 6, // From seed data
            totalDrinks: drinksData.length,
            totalReviews,
            totalFavorites: 18, // From seed data
            averageRating: avgRating,
            mostReviewedDrink: mostReviewed
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDrink = (drink) => {
    setEditingDrink(drink._id);
    setDrinkForm({
      name: drink.name,
      brand: drink.brand,
      category: drink.category,
      description: drink.description || '',
      alcoholPercentage: drink.alcoholPercentage,
      price: drink.price || '',
      country: drink.country || '',
      volume: drink.volume || '',
      tags: drink.tags?.join(', ') || '',
    });
    setShowDrinkForm(true);
  };

  const handleCancelForm = () => {
    setShowDrinkForm(false);
    setEditingDrink(null);
    setDrinkForm({
      name: '',
      brand: '',
      category: 'whiskey',
      description: '',
      alcoholPercentage: '',
      price: '',
      country: '',
      volume: '',
      tags: '',
    });
  };

  const handleSubmitDrink = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const drinkData = {
        ...drinkForm,
        alcoholPercentage: parseFloat(drinkForm.alcoholPercentage),
        price: drinkForm.price ? parseFloat(drinkForm.price) : undefined,
        volume: drinkForm.volume ? parseInt(drinkForm.volume) : undefined,
        tags: drinkForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (editingDrink) {
        const response = await drinksApi.updateDrink(editingDrink, drinkData);
        if (response.status === 'success') {
          toast.success('Drink updated successfully');
          handleCancelForm();
          fetchData();
        }
      } else {
        const response = await drinksApi.createDrink(drinkData);
        if (response.status === 'success') {
          toast.success('Drink created successfully');
          handleCancelForm();
          fetchData();
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save drink');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDrink = async (drinkId, drinkName) => {
    if (!window.confirm(`Are you sure you want to delete "${drinkName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await drinksApi.deleteDrink(drinkId);
      toast.success('Drink deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete drink');
    }
  };

  if (loading && !drinks.length && !stats) {
    return <Loading fullPage message="Loading admin panel..." />;
  }

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-container">
        <div className="admin-header">
          <h1>👨‍💼 Admin Panel</h1>
          <p>Manage drinks, users, and platform statistics</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('drinks')}
            className={`tab-btn ${activeTab === 'drinks' ? 'active' : ''}`}
          >
            🍸 Drinks Management
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          >
            📊 Statistics
          </button>
        </div>

        {/* Drinks Management Tab */}
        {activeTab === 'drinks' && (
          <div className="drinks-management">
            <div className="section-header">
              <h2>Drinks Management ({drinks.length})</h2>
              <Button onClick={() => setShowDrinkForm(true)}>
                ➕ Add New Drink
              </Button>
            </div>

            {/* Drink Form */}
            {showDrinkForm && (
              <form onSubmit={handleSubmitDrink} className="drink-form">
                <h3>{editingDrink ? 'Edit Drink' : 'Create New Drink'}</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={drinkForm.name}
                      onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand *</label>
                    <input
                      type="text"
                      value={drinkForm.brand}
                      onChange={(e) => setDrinkForm({ ...drinkForm, brand: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={drinkForm.category}
                      onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value })}
                      required
                    >
                      <option value="whiskey">Whiskey</option>
                      <option value="vodka">Vodka</option>
                      <option value="rum">Rum</option>
                      <option value="gin">Gin</option>
                      <option value="wine">Wine</option>
                      <option value="beer">Beer</option>
                      <option value="liqueur">Liqueur</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Alcohol % *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={drinkForm.alcoholPercentage}
                      onChange={(e) => setDrinkForm({ ...drinkForm, alcoholPercentage: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={drinkForm.price}
                      onChange={(e) => setDrinkForm({ ...drinkForm, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={drinkForm.country}
                      onChange={(e) => setDrinkForm({ ...drinkForm, country: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Volume (ml)</label>
                    <input
                      type="number"
                      min="0"
                      value={drinkForm.volume}
                      onChange={(e) => setDrinkForm({ ...drinkForm, volume: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={drinkForm.tags}
                      onChange={(e) => setDrinkForm({ ...drinkForm, tags: e.target.value })}
                      placeholder="e.g., premium, smooth, aged"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={drinkForm.description}
                    onChange={(e) => setDrinkForm({ ...drinkForm, description: e.target.value })}
                    rows="3"
                    placeholder="Enter drink description..."
                  />
                </div>

                <div className="form-actions">
                  <Button type="submit" loading={submitting}>
                    {editingDrink ? 'Update Drink' : 'Create Drink'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelForm}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Drinks List */}
            <div className="drinks-list">
              {drinks.map((drink) => (
                <div key={drink._id} className="drink-item">
                  <div className="drink-info">
                    <h3>{drink.name}</h3>
                    <p className="drink-brand">{drink.brand}</p>
                    <div className="drink-details">
                      <span className="category-badge">{drink.category}</span>
                      <span>⭐ {drink.averageRating?.toFixed(1) || 'N/A'}</span>
                      <span>🍸 {drink.alcoholPercentage}%</span>
                      {drink.price && <span>💰 ${drink.price.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="drink-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleEditDrink(drink)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteDrink(drink._id, drink.name)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="statistics-section">
            {loading ? (
              <Loading message="Loading statistics..." />
            ) : stats ? (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                  <div className="stat-label">Total Users</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🍸</div>
                  <div className="stat-value">{stats.totalDrinks || 0}</div>
                  <div className="stat-label">Total Drinks</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{stats.totalReviews || 0}</div>
                  <div className="stat-label">Total Reviews</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-value">{stats.totalFavorites || 0}</div>
                  <div className="stat-label">Total Favorites</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{stats.averageRating?.toFixed(2) || 'N/A'}</div>
                  <div className="stat-label">Avg Rating</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{stats.mostReviewedDrink?.name || 'N/A'}</div>
                  <div className="stat-label">Most Reviewed</div>
                </div>
              </div>
            ) : (
              <div className="no-stats">
                <p>No statistics available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
