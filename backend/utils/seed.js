import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserInfo from '../models/UserInfo.js';
import Drink from '../models/Drink.js';
import Grade from '../models/Grade.js';
import FavoriteDrink from '../models/FavoriteDrink.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@drinkadvisor.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'Password123!'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'Password123!'
  },
  {
    username: 'mikewilson',
    email: 'mike@example.com',
    password: 'Password123!'
  },
  {
    username: 'sarahjones',
    email: 'sarah@example.com',
    password: 'Password123!'
  },
  {
    username: 'tomsmith',
    email: 'tom@example.com',
    password: 'Password123!'
  }
];

const drinks = [
  // Whisky
  {
    name: 'Johnnie Walker Black Label',
    category: 'whisky',
    subcategory: 'Blended Scotch',
    description: 'Rich, smooth, and complex blended Scotch whisky with a perfect balance of sweet and smoky flavors.',
    alcoholPercentage: 40,
    price: 139.99,
    volume: 700,
    brand: 'Johnnie Walker',
    country: 'Scotland',
    tags: ['smoky', 'smooth', 'premium']
  },
  {
    name: 'Jack Daniels Old No. 7',
    category: 'whisky',
    subcategory: 'Tennessee Whiskey',
    description: 'Iconic American whiskey with a smooth, mellow character and hints of vanilla, oak, and caramel.',
    alcoholPercentage: 40,
    price: 99.99,
    volume: 700,
    brand: 'Jack Daniels',
    country: 'USA',
    tags: ['classic', 'smooth', 'vanilla']
  },
  {
    name: 'Glenfiddich 12 Year Old',
    category: 'whisky',
    subcategory: 'Single Malt Scotch',
    description: 'Fresh and fruity single malt with notes of pear, apple, and subtle oak.',
    alcoholPercentage: 40,
    price: 159.99,
    volume: 700,
    brand: 'Glenfiddich',
    country: 'Scotland',
    tags: ['fruity', 'smooth', 'aged']
  },
  {
    name: 'Jameson Irish Whiskey',
    category: 'whisky',
    subcategory: 'Irish Whiskey',
    description: 'Triple-distilled smooth Irish whiskey with a perfect balance of nutty and vanilla notes.',
    alcoholPercentage: 40,
    price: 89.99,
    volume: 700,
    brand: 'Jameson',
    country: 'Ireland',
    tags: ['smooth', 'versatile', 'triple-distilled']
  },
  {
    name: 'Chivas Regal 12',
    category: 'whisky',
    subcategory: 'Blended Scotch',
    description: 'Premium blended Scotch with rich honey, vanilla, and ripe apple notes.',
    alcoholPercentage: 40,
    price: 129.99,
    volume: 700,
    brand: 'Chivas Regal',
    country: 'Scotland',
    tags: ['premium', 'smooth', 'rich']
  },

  // Vodka
  {
    name: 'Belvedere Vodka',
    category: 'vodka',
    subcategory: 'Premium Polish',
    description: 'Pure luxury vodka with a velvety smooth texture and subtle vanilla notes.',
    alcoholPercentage: 40,
    price: 149.99,
    volume: 700,
    brand: 'Belvedere',
    country: 'Poland',
    tags: ['luxury', 'smooth', 'pure']
  },
  {
    name: 'Absolut Vodka',
    category: 'vodka',
    subcategory: 'Swedish Vodka',
    description: 'Rich, full-bodied Swedish vodka with complex yet smooth and mellow taste.',
    alcoholPercentage: 40,
    price: 79.99,
    volume: 700,
    brand: 'Absolut',
    country: 'Sweden',
    tags: ['classic', 'versatile', 'smooth']
  },
  {
    name: 'Grey Goose',
    category: 'vodka',
    subcategory: 'French Vodka',
    description: 'Ultra-premium French vodka with exceptionally smooth taste and subtle sweetness.',
    alcoholPercentage: 40,
    price: 169.99,
    volume: 700,
    brand: 'Grey Goose',
    country: 'France',
    tags: ['premium', 'smooth', 'luxury']
  },
  {
    name: 'Smirnoff No. 21',
    category: 'vodka',
    subcategory: 'Classic Vodka',
    description: 'Classic vodka with a clean, crisp taste that works perfectly in cocktails.',
    alcoholPercentage: 37.5,
    price: 59.99,
    volume: 700,
    brand: 'Smirnoff',
    country: 'Russia',
    tags: ['classic', 'mixer', 'affordable']
  },
  {
    name: 'Ciroc',
    category: 'vodka',
    subcategory: 'Grape Vodka',
    description: 'Unique vodka distilled from fine French grapes, offering a smooth and fruity taste.',
    alcoholPercentage: 40,
    price: 139.99,
    volume: 700,
    brand: 'Ciroc',
    country: 'France',
    tags: ['fruity', 'unique', 'premium']
  },

  // Rum
  {
    name: 'Bacardi Superior',
    category: 'rum',
    subcategory: 'White Rum',
    description: 'Light and smooth white rum perfect for cocktails, with subtle vanilla and almond notes.',
    alcoholPercentage: 37.5,
    price: 69.99,
    volume: 700,
    brand: 'Bacardi',
    country: 'Puerto Rico',
    tags: ['light', 'smooth', 'mixer']
  },
  {
    name: 'Captain Morgan Spiced Gold',
    category: 'rum',
    subcategory: 'Spiced Rum',
    description: 'Rich and bold spiced rum with vanilla, brown sugar, and warming spices.',
    alcoholPercentage: 35,
    price: 79.99,
    volume: 700,
    brand: 'Captain Morgan',
    country: 'Jamaica',
    tags: ['spiced', 'sweet', 'versatile']
  },
  {
    name: 'Havana Club 7 Years',
    category: 'rum',
    subcategory: 'Aged Rum',
    description: 'Smooth Cuban rum aged for 7 years with notes of vanilla, tobacco, and dried fruits.',
    alcoholPercentage: 40,
    price: 119.99,
    volume: 700,
    brand: 'Havana Club',
    country: 'Cuba',
    tags: ['aged', 'smooth', 'complex']
  },
  {
    name: 'Malibu Coconut',
    category: 'rum',
    subcategory: 'Flavored Rum',
    description: 'Tropical coconut-flavored rum liqueur, perfect for summer cocktails.',
    alcoholPercentage: 21,
    price: 64.99,
    volume: 700,
    brand: 'Malibu',
    country: 'Barbados',
    tags: ['coconut', 'sweet', 'tropical']
  },

  // Gin
  {
    name: 'Bombay Sapphire',
    category: 'gin',
    subcategory: 'London Dry Gin',
    description: 'Premium gin with a complex blend of 10 botanicals for a smooth, balanced taste.',
    alcoholPercentage: 40,
    price: 99.99,
    volume: 700,
    brand: 'Bombay Sapphire',
    country: 'England',
    tags: ['botanical', 'smooth', 'premium']
  },
  {
    name: 'Tanqueray London Dry',
    category: 'gin',
    subcategory: 'London Dry Gin',
    description: 'Classic London Dry gin with juniper, coriander, and angelica root.',
    alcoholPercentage: 43.1,
    price: 89.99,
    volume: 700,
    brand: 'Tanqueray',
    country: 'England',
    tags: ['classic', 'juniper', 'strong']
  },
  {
    name: 'Hendricks Gin',
    category: 'gin',
    subcategory: 'Scottish Gin',
    description: 'Unique gin infused with cucumber and rose petals for an unusual and delicious taste.',
    alcoholPercentage: 41.4,
    price: 139.99,
    volume: 700,
    brand: 'Hendricks',
    country: 'Scotland',
    tags: ['unique', 'cucumber', 'premium']
  },

  // Wine
  {
    name: 'Château Margaux 2015',
    category: 'wine',
    subcategory: 'Red Wine',
    description: 'Elegant Bordeaux red wine with complex flavors of dark fruits, oak, and spices.',
    alcoholPercentage: 13.5,
    price: 899.99,
    volume: 750,
    brand: 'Château Margaux',
    country: 'France',
    yearProduced: 2015,
    tags: ['luxury', 'aged', 'complex']
  },
  {
    name: 'Moët & Chandon Brut Imperial',
    category: 'wine',
    subcategory: 'Champagne',
    description: 'Iconic champagne with vibrant fruit notes and an elegant maturity.',
    alcoholPercentage: 12,
    price: 189.99,
    volume: 750,
    brand: 'Moët & Chandon',
    country: 'France',
    tags: ['champagne', 'luxury', 'celebration']
  },
  {
    name: 'Yellow Tail Shiraz',
    category: 'wine',
    subcategory: 'Red Wine',
    description: 'Smooth Australian red wine with rich berry flavors and soft tannins.',
    alcoholPercentage: 13.5,
    price: 49.99,
    volume: 750,
    brand: 'Yellow Tail',
    country: 'Australia',
    tags: ['fruity', 'smooth', 'affordable']
  },

  // Beer
  {
    name: 'Guinness Draught',
    category: 'beer',
    subcategory: 'Stout',
    description: 'Iconic Irish stout with a rich, creamy head and notes of coffee and chocolate.',
    alcoholPercentage: 4.2,
    price: 8.99,
    volume: 440,
    brand: 'Guinness',
    country: 'Ireland',
    tags: ['stout', 'creamy', 'classic']
  },
  {
    name: 'Heineken Lager',
    category: 'beer',
    subcategory: 'Lager',
    description: 'Crisp, refreshing premium lager with a slightly bitter taste.',
    alcoholPercentage: 5,
    price: 6.99,
    volume: 500,
    brand: 'Heineken',
    country: 'Netherlands',
    tags: ['lager', 'crisp', 'refreshing']
  },
  {
    name: 'Corona Extra',
    category: 'beer',
    subcategory: 'Pale Lager',
    description: 'Light Mexican beer perfect for hot days, best served with lime.',
    alcoholPercentage: 4.5,
    price: 7.99,
    volume: 355,
    brand: 'Corona',
    country: 'Mexico',
    tags: ['light', 'refreshing', 'summer']
  },

  // Liqueur
  {
    name: 'Baileys Irish Cream',
    category: 'liqueur',
    subcategory: 'Cream Liqueur',
    description: 'Smooth and creamy liqueur with Irish whiskey, cream, and cocoa.',
    alcoholPercentage: 17,
    price: 89.99,
    volume: 700,
    brand: 'Baileys',
    country: 'Ireland',
    tags: ['creamy', 'sweet', 'dessert']
  },
  {
    name: 'Jägermeister',
    category: 'liqueur',
    subcategory: 'Herbal Liqueur',
    description: 'German herbal liqueur with 56 herbs, roots, and spices.',
    alcoholPercentage: 35,
    price: 79.99,
    volume: 700,
    brand: 'Jägermeister',
    country: 'Germany',
    tags: ['herbal', 'strong', 'digestif']
  },
  {
    name: 'Cointreau',
    category: 'liqueur',
    subcategory: 'Orange Liqueur',
    description: 'Premium orange liqueur with a perfect balance of sweet and bitter orange peels.',
    alcoholPercentage: 40,
    price: 119.99,
    volume: 700,
    brand: 'Cointreau',
    country: 'France',
    tags: ['orange', 'premium', 'cocktail']
  },

  // Cocktail Bases
  {
    name: 'Aperol',
    category: 'liqueur',
    subcategory: 'Aperitif',
    description: 'Bright orange Italian aperitif with a unique bittersweet taste of orange and herbs.',
    alcoholPercentage: 11,
    price: 69.99,
    volume: 700,
    brand: 'Aperol',
    country: 'Italy',
    tags: ['aperitif', 'bitter', 'cocktail']
  },
  {
    name: 'Campari',
    category: 'liqueur',
    subcategory: 'Bitter',
    description: 'Iconic Italian bitter liqueur with a distinctive red color and complex herbal flavor.',
    alcoholPercentage: 25,
    price: 89.99,
    volume: 700,
    brand: 'Campari',
    country: 'Italy',
    tags: ['bitter', 'herbal', 'cocktail']
  },
  {
    name: 'Kahlúa',
    category: 'liqueur',
    subcategory: 'Coffee Liqueur',
    description: 'Rich coffee liqueur from Mexico with notes of vanilla and caramel.',
    alcoholPercentage: 20,
    price: 74.99,
    volume: 700,
    brand: 'Kahlúa',
    country: 'Mexico',
    tags: ['coffee', 'sweet', 'dessert']
  },
  {
    name: 'Tequila Patrón Silver',
    category: 'other',
    subcategory: 'Tequila',
    description: 'Ultra-premium silver tequila with a smooth, sweet taste and citrus notes.',
    alcoholPercentage: 40,
    price: 199.99,
    volume: 700,
    brand: 'Patrón',
    country: 'Mexico',
    tags: ['premium', 'smooth', 'agave']
  },
  {
    name: 'Hennessy VS Cognac',
    category: 'other',
    subcategory: 'Cognac',
    description: 'Classic cognac with bold, fruity notes and a hint of oak and vanilla.',
    alcoholPercentage: 40,
    price: 179.99,
    volume: 700,
    brand: 'Hennessy',
    country: 'France',
    tags: ['cognac', 'premium', 'smooth']
  }
];

const userInfos = [
  {
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Whisky enthusiast and collector',
    location: 'Edinburgh, Scotland',
    favoriteCategory: 'whisky'
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    bio: 'Wine lover exploring the world of spirits',
    location: 'Bordeaux, France',
    favoriteCategory: 'wine'
  },
  {
    firstName: 'Mike',
    lastName: 'Wilson',
    bio: 'Craft beer aficionado and home brewer',
    location: 'Dublin, Ireland',
    favoriteCategory: 'beer'
  },
  {
    firstName: 'Sarah',
    lastName: 'Jones',
    bio: 'Mixologist and cocktail creator',
    location: 'New York, USA',
    favoriteCategory: 'gin'
  },
  {
    firstName: 'Tom',
    lastName: 'Smith',
    bio: 'Rum collector with a passion for Caribbean spirits',
    location: 'Barbados',
    favoriteCategory: 'rum'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await UserInfo.deleteMany({});
    await Drink.deleteMany({});
    await Grade.deleteMany({});
    await FavoriteDrink.deleteMany({});

    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('📝 Creating user info...');
    const userInfosWithRefs = userInfos.map((info, index) => ({
      ...info,
      user: createdUsers[index + 1]._id // Skip admin user
    }));
    await UserInfo.create(userInfosWithRefs);
    console.log(`✅ Created ${userInfos.length} user info records`);

    console.log('🍸 Creating drinks...');
    const createdDrinks = await Drink.create(drinks);
    console.log(`✅ Created ${createdDrinks.length} drinks`);

    console.log('⭐ Creating grades (reviews)...');
    const grades = [];
    
    // Create multiple reviews for each drink
    for (let i = 0; i < createdDrinks.length; i++) {
      const drink = createdDrinks[i];
      const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews per drink
      
      for (let j = 0; j < numReviews && j < createdUsers.length - 1; j++) {
        grades.push({
          user: createdUsers[j + 1]._id, // Skip admin
          drink: drink._id,
          rating: Math.floor(Math.random() * 3) + 3, // Rating 3-5
          comment: generateComment(drink.category, drink.name)
        });
      }
    }
    
    const createdGrades = await Grade.create(grades);
    console.log(`✅ Created ${createdGrades.length} grades`);

    console.log('❤️  Creating favorite drinks...');
    const favorites = [];
    
    // Each user favorites 3-5 random drinks
    for (let i = 1; i < createdUsers.length; i++) {
      const numFavorites = Math.floor(Math.random() * 3) + 3;
      const shuffledDrinks = [...createdDrinks].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numFavorites; j++) {
        favorites.push({
          user: createdUsers[i]._id,
          drink: shuffledDrinks[j]._id
        });
      }
    }
    
    await FavoriteDrink.create(favorites);
    console.log(`✅ Created ${favorites.length} favorite drinks`);

    // Update drink ratings
    console.log('🔄 Updating drink ratings...');
    for (const drink of createdDrinks) {
      await drink.updateAverageRating();
    }
    console.log('✅ Updated all drink ratings');

    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        ✅ Database Seeded Successfully!               ║
║                                                       ║
║        Users: ${String(createdUsers.length).padEnd(3)} (including 1 admin)            ║
║        Drinks: ${String(createdDrinks.length).padEnd(2)}                                 ║
║        Reviews: ${String(createdGrades.length).padEnd(2)}                                ║
║        Favorites: ${String(favorites.length).padEnd(2)}                               ║
║                                                       ║
║        🔐 Admin Credentials:                          ║
║           Email: admin@drinkadvisor.com               ║
║           Password: Admin123!                         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Helper function to generate realistic comments
function generateComment(category, drinkName) {
  const comments = {
    whisky: [
      'Smooth and complex, perfect for sipping.',
      'Rich flavors with a great finish. Highly recommend!',
      'One of the best whiskies I\'ve tried. Great value for money.',
      'Beautiful balance of sweet and smoky notes.',
      'Excellent whisky, will definitely buy again.'
    ],
    vodka: [
      'Very smooth, perfect for cocktails.',
      'Clean taste, no harsh aftertaste.',
      'Premium quality vodka, worth the price.',
      'Great for mixing or drinking neat.',
      'Smooth and versatile, a staple in my bar.'
    ],
    rum: [
      'Perfect for mojitos and daiquiris!',
      'Smooth with great flavor, love it!',
      'Best rum for the price.',
      'Rich and flavorful, excellent choice.',
      'Great for cocktails and mixing.'
    ],
    gin: [
      'Perfect for gin and tonic!',
      'Beautiful botanical flavors.',
      'Smooth and aromatic, my go-to gin.',
      'Excellent quality, great for cocktails.',
      'Complex and well-balanced.'
    ],
    wine: [
      'Elegant and sophisticated.',
      'Perfect wine for special occasions.',
      'Great taste and excellent value.',
      'Smooth and fruity, very enjoyable.',
      'One of my favorite wines!'
    ],
    beer: [
      'Refreshing and delicious!',
      'Perfect beer for any occasion.',
      'Great taste, very drinkable.',
      'Smooth and balanced.',
      'My favorite beer!'
    ],
    liqueur: [
      'Sweet and delicious!',
      'Perfect for dessert drinks.',
      'Great flavor, very smooth.',
      'Excellent liqueur, highly recommend.',
      'Perfect for after-dinner drinks.'
    ],
    cocktail: [
      'Great base for cocktails!',
      'Perfect mixer.',
      'Versatile and delicious.',
      'Essential for any home bar.',
      'Great quality and flavor.'
    ],
    other: [
      'Excellent quality and taste!',
      'Worth every penny.',
      'Smooth and flavorful.',
      'One of the best I\'ve tried.',
      'Highly recommended!'
    ]
  };

  const categoryComments = comments[category] || comments.other;
  return categoryComments[Math.floor(Math.random() * categoryComments.length)];
}

// Run the seeder
seedDatabase();
