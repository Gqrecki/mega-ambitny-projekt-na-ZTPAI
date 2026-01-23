import React from 'react';
import { Link } from 'react-router-dom';
import './DrinkCard.css';

const DrinkCard = ({ drink, showActions = false, onFavoriteToggle, isFavorited }) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (onFavoriteToggle) {
      onFavoriteToggle(drink._id);
    }
  };

  return (
    <Link to={`/drinks/${drink._id}`} className="drink-card">
      <div className="drink-card-image">
        <div className="drink-category-badge">{drink.category}</div>
        {showActions && (
          <button
            className={`drink-favorite-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="drink-card-content">
        <h3 className="drink-card-name">{drink.name}</h3>
        <p className="drink-card-brand">{drink.brand}</p>
        {drink.description && (
          <p className="drink-card-description">
            {drink.description.length > 80
              ? `${drink.description.substring(0, 80)}...`
              : drink.description}
          </p>
        )}
        <div className="drink-card-footer">
          <div className="drink-rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">
              {drink.averageRating?.toFixed(1) || 'N/A'}
            </span>
            <span className="rating-count">
              ({drink.numberOfRatings || 0})
            </span>
          </div>
          <div className="drink-alcohol">{drink.alcoholPercentage}%</div>
        </div>
        {drink.price && (
          <div className="drink-price">${drink.price.toFixed(2)}</div>
        )}
      </div>
    </Link>
  );
};

export default DrinkCard;
