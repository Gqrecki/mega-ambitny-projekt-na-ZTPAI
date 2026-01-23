import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drinksApi, gradesApi, favoritesApi } from '../api';
import { Loading } from '../components';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [trendingDrinks, setTrendingDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch trending drinks
      const trendingResponse = await drinksApi.getTrendingDrinks();
      if (trendingResponse.status === 'success') {
        setTrendingDrinks(trendingResponse.data.drinks.slice(0, 6));
      }

      // Fetch user stats if authenticated
      if (user) {
        try {
          const favStats = await favoritesApi.getMyFavoriteStats();
          const myGrades = await gradesApi.getMyGrades();
          
          setStats({
            favorites: favStats.data?.totalFavorites || 0,
            reviews: myGrades.data?.grades?.length || 0,
          });
        } catch (error) {
          // User stats are optional
          console.log('Could not fetch user stats');
        }
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <section className="dashboard-welcome">
          <h1 className="dashboard-title">
            Welcome {user ? user.username : 'to DrinkAdvisor'}!
          </h1>
          <p className="dashboard-subtitle">
            Discover, rate, and save your favorite drinks
          </p>
        </section>

        {/* Stats Section (for authenticated users) */}
        {user && stats && (
          <section className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <div className="stat-value">{stats.favorites}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{stats.reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🍸</div>
              <div className="stat-content">
                <div className="stat-value">{trendingDrinks.length}</div>
                <div className="stat-label">Trending</div>
              </div>
            </div>
          </section>
        )}

        {/* Trending Drinks Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Trending Drinks</h2>
            <Link to="/drinks" className="section-link">
              View All →
            </Link>
          </div>

          {trendingDrinks.length > 0 ? (
            <div className="drinks-grid">
              {trendingDrinks.map((drink) => (
                <Link
                  key={drink._id}
                  to={`/drinks/${drink._id}`}
                  className="drink-card"
                >
                  <div className="drink-image">
                    <div className="drink-category">{drink.category}</div>
                  </div>
                  <div className="drink-content">
                    <h3 className="drink-name">{drink.name}</h3>
                    <p className="drink-brand">{drink.brand}</p>
                    <div className="drink-footer">
                      <div className="drink-rating">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">
                          {drink.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="drink-alcohol">{drink.alcoholPercentage}%</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state">No trending drinks found</p>
          )}
        </section>

        {/* Quick Actions */}
        <section className="dashboard-actions">
          <Link to="/drinks" className="action-card">
            <span className="action-icon">🔍</span>
            <span className="action-text">Browse All Drinks</span>
          </Link>
          {user ? (
            <>
              <Link to="/favorites" className="action-card">
                <span className="action-icon">❤️</span>
                <span className="action-text">My Favorites</span>
              </Link>
              <Link to="/my-reviews" className="action-card">
                <span className="action-icon">📝</span>
                <span className="action-text">My Reviews</span>
              </Link>
            </>
          ) : (
            <Link to="/register" className="action-card action-card-primary">
              <span className="action-icon">✨</span>
              <span className="action-text">Join Now</span>
            </Link>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
