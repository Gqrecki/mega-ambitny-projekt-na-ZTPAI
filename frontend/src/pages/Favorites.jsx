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

  const handleUpdateNotes = async (favoriteId, notes) => {
    try {
      const response = await favoritesApi.updateFavorite(favoriteId, { notes });
      if (response.status === 'success') {
        setFavorites(
          favorites.map((fav) =>
            fav._id === favoriteId ? { ...fav, notes } : fav
          )
        );
        toast.success('Notes updated');
      }
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const handleUpdateTags = async (favoriteId, tags) => {
    try {
      const response = await favoritesApi.updateFavorite(favoriteId, { tags });
      if (response.status === 'success') {
        setFavorites(
          favorites.map((fav) =>
            fav._id === favoriteId ? { ...fav, tags } : fav
          )
        );
        toast.success('Tags updated');
      }
    } catch (error) {
      toast.error('Failed to update tags');
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
                    
                    {/* Notes Section */}
                    <div className="favorite-details">
                      <div className="notes-section">
                        <label>Personal Notes:</label>
                        <textarea
                          value={favorite.notes || ''}
                          onChange={(e) => {
                            const updatedFavorites = favorites.map((fav) =>
                              fav._id === favorite._id ? { ...fav, notes: e.target.value } : fav
                            );
                            setFavorites(updatedFavorites);
                          }}
                          onBlur={(e) => handleUpdateNotes(favorite._id, e.target.value)}
                          placeholder="Add your personal notes about this drink..."
                          rows="2"
                          className="notes-textarea"
                        />
                      </div>

                      {/* Tags Section */}
                      <div className="tags-section">
                        <label>Tags:</label>
                        <input
                          type="text"
                          value={favorite.tags?.join(', ') || ''}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean);
                            const updatedFavorites = favorites.map((fav) =>
                              fav._id === favorite._id ? { ...fav, tags } : fav
                            );
                            setFavorites(updatedFavorites);
                          }}
                          onBlur={(e) => {
                            const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean);
                            handleUpdateTags(favorite._id, tags);
                          }}
                          placeholder="Add tags (comma-separated)"
                          className="tags-input"
                        />
                        {favorite.tags && favorite.tags.length > 0 && (
                          <div className="tags-display">
                            {favorite.tags.map((tag, index) => (
                              <span key={index} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="favorite-meta">
                        <span className="added-date">
                          Added: {new Date(favorite.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
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
