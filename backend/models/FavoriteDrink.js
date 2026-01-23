import mongoose from 'mongoose';

const favoriteDrinkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    drink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drink',
      required: [true, 'Drink reference is required']
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one user can favorite a drink only once
favoriteDrinkSchema.index({ user: 1, drink: 1 }, { unique: true });

// Index for user queries
favoriteDrinkSchema.index({ user: 1, createdAt: -1 });

// Index for drink queries (to see who favorited it)
favoriteDrinkSchema.index({ drink: 1 });

const FavoriteDrink = mongoose.model('FavoriteDrink', favoriteDrinkSchema);

export default FavoriteDrink;
