import mongoose from 'mongoose';

const drinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Drink name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Drink name must be at least 2 characters'],
      maxlength: [100, 'Drink name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['whisky', 'vodka', 'rum', 'gin', 'wine', 'beer', 'cocktail', 'liqueur', 'other'],
        message: '{VALUE} is not a valid category'
      }
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: [50, 'Subcategory cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    alcoholPercentage: {
      type: Number,
      required: [true, 'Alcohol percentage is required'],
      min: [0, 'Alcohol percentage cannot be negative'],
      max: [100, 'Alcohol percentage cannot exceed 100']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'PLN',
      enum: ['PLN', 'USD', 'EUR', 'GBP']
    },
    volume: {
      type: Number, // in milliliters
      required: [true, 'Volume is required'],
      min: [0, 'Volume cannot be negative']
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Drink'
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, 'Brand name cannot exceed 100 characters']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters']
    },
    yearProduced: {
      type: Number,
      min: [1800, 'Year must be after 1800'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    tags: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numberOfRatings: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for grades
drinkSchema.virtual('grades', {
  ref: 'Grade',
  localField: '_id',
  foreignField: 'drink'
});

// Indexes for better query performance
drinkSchema.index({ name: 'text', description: 'text' });
drinkSchema.index({ category: 1, averageRating: -1 });
drinkSchema.index({ price: 1 });
drinkSchema.index({ averageRating: -1 });

// Method to calculate average rating
drinkSchema.methods.updateAverageRating = async function () {
  const Grade = mongoose.model('Grade');
  const stats = await Grade.aggregate([
    {
      $match: { drink: this._id }
    },
    {
      $group: {
        _id: '$drink',
        avgRating: { $avg: '$rating' },
        numRatings: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].avgRating * 10) / 10;
    this.numberOfRatings = stats[0].numRatings;
  } else {
    this.averageRating = 0;
    this.numberOfRatings = 0;
  }

  await this.save();
};

const Drink = mongoose.model('Drink', drinkSchema);

export default Drink;
