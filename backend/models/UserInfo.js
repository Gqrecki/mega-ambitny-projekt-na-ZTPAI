import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    dateOfBirth: {
      type: Date
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[\d\s\+\-\(\)]+$/, 'Please provide a valid phone number']
    },
    favoriteCategory: {
      type: String,
      enum: ['whisky', 'vodka', 'rum', 'gin', 'wine', 'beer', 'cocktail', 'liqueur', 'other', null],
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster user lookups
userInfoSchema.index({ user: 1 });

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

export default UserInfo;
