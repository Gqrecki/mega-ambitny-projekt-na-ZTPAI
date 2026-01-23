import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoritesApi } from '../api';
import { Loading, Button, DrinkCard } from '../components';
import { toast } from 'react-toastify';
import './Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesApi.getMyFavorites();
      if (response.status === 'success') {
        setFavorites(response.data.favorites || []);
      }
    } catch (error) {
      toast.error('Failed to load favorites');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (drinkId) => {
    try {
      await favoritesApi.removeFavorite(drinkId);
      setFavorites(favorites.filter((fav) => fav.drink._id !== drinkId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  // Filter favorites by category
  const filteredFavorites = favorites.filter((fav) => {
    if (filter === 'all') return true;
    return fav.drink?.category === filter;
  });

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.drink?.name.localeCompare(b.drink?.name);
      case 'rating':
        return (b.drink?.averageRating || 0) - (a.drink?.averageRating || 0);
      default:
        return 0;
    }
  });

  // Get unique categories from favorites
  const categories = ['all', ...new Set(favorites.map((fav) => fav.drink?.category).filter(Boolean))];

  if (loading) {
    return <Loading fullPage message="Loading your favorites..." />;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>❤️ My Favorites</h1>
          <p>You have {favorites.length} favorite drinks</p>
        </div>

        {favorites.length > 0 ? (
          <>
            {/* Filters */}
            <div className="favorites-controls">
              <div className="filter-group">
                <label>Category:</label>
                <div className="category-filters">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`filter-btn ${filter === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sort-group">
                <label htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recent">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Favorites Grid */}
            {sortedFavorites.length > 0 ? (
              <div className="favorites-grid">
                {sortedFavorites.map((favorite) => (
                  <div key={favorite._id} className="favorite-item">
                    <DrinkCard
                      drink={favorite.drink}
                      showActions={true}
                      onFavoriteToggle={() => handleRemoveFavorite(favorite.drink._id)}
                      isFavorited={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No favorites match the selected filter.</p>
                <Button onClick={() => setFilter('all')}>Show All</Button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h2>No favorites yet</h2>
            <p>Start exploring drinks and add your favorites!</p>
            <Button onClick={() => navigate('/drinks')}>Browse Drinks</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
