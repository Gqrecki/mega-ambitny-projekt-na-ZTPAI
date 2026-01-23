import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { drinksApi, gradesApi, favoritesApi } from '../api';
import { Loading, Button } from '../components';
import { toast } from 'react-toastify';
import './DrinkDetails.css';

const DrinkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [drink, setDrink] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDrinkDetails();
  }, [id]);

  const fetchDrinkDetails = async () => {
    try {
      setLoading(true);

      // Fetch drink details
      const drinkResponse = await drinksApi.getDrinkById(id);
      if (drinkResponse.status === 'success') {
        setDrink(drinkResponse.data);
      }

      // Fetch reviews
      const reviewsResponse = await gradesApi.getGradesByDrink(id);
      if (reviewsResponse.status === 'success') {
        setReviews(reviewsResponse.data.grades || []);
        
        // Check if user has already reviewed
        if (isAuthenticated && user) {
          const existingReview = reviewsResponse.data.grades?.find(
            (review) => review.user?._id === user.id || review.user?.id === user.id
          );
          if (existingReview) {
            setUserReview(existingReview);
            setReviewForm({
              rating: existingReview.rating,
              comment: existingReview.comment || '',
            });
          }
        }
      }

      // Check if favorited
      if (isAuthenticated) {
        try {
          const favoriteResponse = await favoritesApi.checkFavorite(id);
          if (favoriteResponse.status === 'success') {
            setIsFavorited(favoriteResponse.data.isFavorited);
          }
        } catch (error) {
          // Not favorited
          setIsFavorited(false);
        }
      }
    } catch (error) {
      toast.error('Failed to load drink details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await favoritesApi.removeFavorite(id);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesApi.addFavorite({ drinkId: id });
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please login to leave a review');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);

      if (userReview) {
        // Update existing review
        const response = await gradesApi.updateGrade(userReview._id, reviewForm);
        if (response.status === 'success') {
          toast.success('Review updated successfully');
          setShowReviewForm(false);
          fetchDrinkDetails();
        }
      } else {
        // Create new review
        const response = await gradesApi.createGrade({
          drinkId: id,
          ...reviewForm,
        });
        if (response.status === 'success') {
          toast.success('Review submitted successfully');
          setShowReviewForm(false);
          fetchDrinkDetails();
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!userReview || !window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await gradesApi.deleteGrade(userReview._id);
      toast.success('Review deleted successfully');
      setUserReview(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchDrinkDetails();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      toast.info('Please login to mark reviews as helpful');
      return;
    }

    try {
      await gradesApi.markAsHelpful(reviewId);
      toast.success('Marked as helpful');
      fetchDrinkDetails();
    } catch (error) {
      toast.error('Failed to mark as helpful');
    }
  };

  const handleAdminDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await gradesApi.deleteGrade(reviewId);
      toast.success('Review deleted successfully');
      fetchDrinkDetails();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading drink details..." />;
  }

  if (!drink) {
    return (
      <div className="drink-details-error">
        <h2>Drink not found</h2>
        <Button onClick={() => navigate('/drinks')}>Back to Drinks</Button>
      </div>
    );
  }

  return (
    <div className="drink-details-page">
      <div className="drink-details-container">
        {/* Back Button */}
        <button onClick={() => navigate('/drinks')} className="back-button">
          ← Back to Drinks
        </button>

        {/* Drink Info */}
        <div className="drink-info-section">
          <div className="drink-image-large">
            <div className="drink-category-badge">{drink.category}</div>
          </div>

          <div className="drink-main-info">
            <h1 className="drink-name">{drink.name}</h1>
            <p className="drink-brand">{drink.brand}</p>

            <div className="drink-stats">
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{drink.averageRating?.toFixed(1) || 'N/A'}</span>
                <span className="stat-label">({drink.numberOfRatings || 0} reviews)</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🍸</span>
                <span className="stat-value">{drink.alcoholPercentage}%</span>
                <span className="stat-label">Alcohol</span>
              </div>
              {drink.price && (
                <div className="stat-item">
                  <span className="stat-icon">💰</span>
                  <span className="stat-value">${drink.price.toFixed(2)}</span>
                  <span className="stat-label">Price</span>
                </div>
              )}
            </div>

            <Button
              variant={isFavorited ? 'success' : 'primary'}
              onClick={handleFavoriteToggle}
              fullWidth
            >
              {isFavorited ? '❤️ In Favorites' : '🤍 Add to Favorites'}
            </Button>

            <div className="drink-details-grid">
              <div className="detail-item">
                <span className="detail-label">Country:</span>
                <span className="detail-value">{drink.country || 'N/A'}</span>
              </div>
              {drink.volume && (
                <div className="detail-item">
                  <span className="detail-label">Volume:</span>
                  <span className="detail-value">{drink.volume} ml</span>
                </div>
              )}
            </div>

            {drink.description && (
              <div className="drink-description">
                <h3>Description</h3>
                <p>{drink.description}</p>
              </div>
            )}

            {drink.tags && drink.tags.length > 0 && (
              <div className="drink-tags">
                {drink.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Reviews ({reviews.length})</h2>
            {isAuthenticated && !userReview && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? 'Cancel' : '✏️ Write a Review'}
              </Button>
            )}
            {userReview && (
              <div className="user-review-actions">
                <Button variant="secondary" size="small" onClick={() => setShowReviewForm(!showReviewForm)}>
                  Edit
                </Button>
                <Button variant="danger" size="small" onClick={handleReviewDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating:</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review:</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your thoughts about this drink..."
                  rows="4"
                  className="review-textarea"
                />
              </div>
              <Button type="submit" loading={submitting} fullWidth>
                {userReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </form>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <span className="user-avatar">👤</span>
                      <span className="user-name">
                        {review.user?.username || 'Anonymous'}
                      </span>
                    </div>
                    <div className="review-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="review-comment">{review.comment}</p>}
                  <div className="review-footer">
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className="review-actions">
                      <button
                        onClick={() => handleHelpful(review._id)}
                        className="helpful-btn"
                        disabled={!isAuthenticated}
                      >
                        👍 Helpful ({review.helpfulCount || 0})
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleAdminDeleteReview(review._id)}
                          className="admin-delete-btn"
                          title="Delete review (Admin)"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this drink!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkDetails;
