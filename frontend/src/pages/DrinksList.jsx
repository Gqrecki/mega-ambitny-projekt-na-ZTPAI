import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDrinks } from '../hooks';
import { favoritesApi } from '../api';
import { Loading } from '../components';
import DrinkCard from '../components/DrinkCard';
import './DrinksList.css';

const CATEGORIES = ['all', 'whiskey', 'vodka', 'rum', 'gin', 'wine', 'beer', 'liqueur', 'other'];

const DrinksList = () => {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name');
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const { drinks, loading, error, pagination, setParams, refetch } = useDrinks({
    category: category !== 'all' ? category : undefined,
    sort,
    limit: 12,
  });

  // Load user's favorites if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoadingFavorites(true);
      const response = await favoritesApi.getMyFavorites();
      if (response.status === 'success') {
        const favoriteIds = response.data.favorites.map(f => f.drink._id || f.drink);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setParams({ search: search.trim(), page: 1 });
    } else {
      setParams({ search: undefined, page: 1 });
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setParams({
      category: newCategory !== 'all' ? newCategory : undefined,
      page: 1,
    });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setParams({ sort: newSort, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteToggle = async (drinkId) => {
    if (!isAuthenticated) {
      return;
    }

    const isFavorited = favorites.includes(drinkId);

    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(drinkId);
        setFavorites(favorites.filter(id => id !== drinkId));
      } else {
        await favoritesApi.addFavorite({ drink: drinkId });
        setFavorites([...favorites, drinkId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading && !drinks.length) {
    return <Loading fullPage message="Loading drinks..." />;
  }

  return (
    <div className="drinks-list-page">
      <div className="drinks-container">
        {/* Header */}
        <header className="drinks-header">
          <h1 className="drinks-title">Discover Drinks</h1>
          <p className="drinks-subtitle">
            Browse our collection of {pagination?.total || 0} premium drinks
          </p>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search drinks by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setParams({ search: undefined, page: 1 });
              }}
              className="search-clear"
            >
              Clear
            </button>
          )}
        </form>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <div className="filter-buttons">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`filter-btn ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="-averageRating">Rating (High to Low)</option>
              <option value="averageRating">Rating (Low to High)</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={refetch} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Drinks Grid */}
        {drinks.length > 0 ? (
          <>
            <div className="drinks-grid">
              {drinks.map((drink) => (
                <DrinkCard
                  key={drink._id}
                  drink={drink}
                  showActions={isAuthenticated}
                  isFavorited={favorites.includes(drink._id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                <div className="pagination-info">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍸</div>
            <h3>No drinks found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && drinks.length > 0 && (
          <div className="loading-overlay">
            <Loading message="Loading..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinksList;
