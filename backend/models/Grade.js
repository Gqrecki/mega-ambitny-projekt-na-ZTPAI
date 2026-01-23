import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema(
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
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one user can rate a drink only once
gradeSchema.index({ user: 1, drink: 1 }, { unique: true });

// Index for drink queries
gradeSchema.index({ drink: 1, createdAt: -1 });

// Index for user queries
gradeSchema.index({ user: 1, createdAt: -1 });

// Post-save hook to update drink's average rating
gradeSchema.post('save', async function () {
  const Drink = mongoose.model('Drink');
  const drink = await Drink.findById(this.drink);
  if (drink) {
    await drink.updateAverageRating();
  }
});

// Post-remove hook to update drink's average rating
gradeSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Drink = mongoose.model('Drink');
    const drink = await Drink.findById(doc.drink);
    if (drink) {
      await drink.updateAverageRating();
    }
  }
});

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;
