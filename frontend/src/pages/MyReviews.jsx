import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gradesApi } from '../api';
import { Loading, Button } from '../components';
import { toast } from 'react-toastify';
import './MyReviews.css';

const MyReviews = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyReviews();
  }, [isAuthenticated]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await gradesApi.getMyGrades();
      if (response.status === 'success') {
        setReviews(response.data.grades || []);
      }
    } catch (error) {
      toast.error('Failed to load your reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const response = await gradesApi.updateGrade(editingReview, editForm);
      if (response.status === 'success') {
        toast.success('Review updated successfully');
        setEditingReview(null);
        fetchMyReviews();
      }
    } catch (error) {
      toast.error('Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId, drinkName) => {
    if (!window.confirm(`Are you sure you want to delete your review for "${drinkName}"?`)) {
      return;
    }

    try {
      await gradesApi.deleteGrade(reviewId);
      toast.success('Review deleted successfully');
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return <Loading fullPage message="Loading your reviews..." />;
  }

  return (
    <div className="my-reviews-page">
      <div className="my-reviews-container">
        <div className="my-reviews-header">
          <h1>⭐ My Reviews</h1>
          <p>You have written {reviews.length} reviews</p>
        </div>

        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                {editingReview === review._id ? (
                  /* Edit Form */
                  <form onSubmit={handleUpdateReview} className="edit-form">
                    <div className="form-header">
                      <Link to={`/drinks/${review.drink._id}`} className="drink-link">
                        <h3>{review.drink.name}</h3>
                      </Link>
                    </div>

                    <div className="form-group">
                      <label>Rating:</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            className={`star-btn ${editForm.rating >= star ? 'active' : ''}`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Review:</label>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        placeholder="Share your thoughts..."
                        rows="4"
                        className="review-textarea"
                      />
                    </div>

                    <div className="form-actions">
                      <Button type="submit" loading={submitting}>
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancelEdit}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* Review Display */
                  <div className="review-display">
                    <div className="review-header">
                      <div className="drink-info">
                        <Link to={`/drinks/${review.drink._id}`} className="drink-link">
                          <h3>{review.drink.name}</h3>
                        </Link>
                        <p className="drink-brand">{review.drink.brand}</p>
                        <span className="drink-category">{review.drink.category}</span>
                      </div>
                      <div className="review-actions">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handleEditClick(review)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteReview(review._id, review.drink.name)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>

                    <div className="review-content">
                      <div className="review-rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                        <span className="rating-text">({review.rating}/5)</span>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>

                    <div className="review-meta">
                      <span className="review-date">
                        Posted: {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {review.updatedAt !== review.createdAt && (
                        <span className="review-updated">
                          Updated: {new Date(review.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                      <span className="helpful-count">
                        👍 {review.helpfulCount || 0} found helpful
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No reviews yet</h2>
            <p>Start exploring drinks and share your thoughts!</p>
            <Button onClick={() => navigate('/drinks')}>Browse Drinks</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
