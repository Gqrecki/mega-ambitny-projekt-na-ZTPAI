import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DrinkAdvisor API',
      version: '1.0.0',
      description: 'API documentation for DrinkAdvisor - A platform for rating and discovering drinks',
      contact: {
        name: 'DrinkAdvisor Team',
        email: 'support@drinkadvisor.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.drinkadvisor.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              description: 'Unique username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'User account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Drink: {
          type: 'object',
          required: ['name', 'category', 'description', 'alcoholPercentage', 'price', 'volume'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              description: 'Drink name'
            },
            category: {
              type: 'string',
              enum: ['whisky', 'vodka', 'rum', 'gin', 'wine', 'beer', 'cocktail', 'liqueur', 'other'],
              description: 'Drink category'
            },
            description: {
              type: 'string',
              description: 'Drink description'
            },
            alcoholPercentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Alcohol percentage (ABV)'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Price in specified currency'
            },
            volume: {
              type: 'number',
              description: 'Volume in milliliters'
            },
            averageRating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Average user rating'
            },
            numberOfRatings: {
              type: 'number',
              description: 'Total number of ratings'
            }
          }
        },
        Grade: {
          type: 'object',
          required: ['user', 'drink', 'rating'],
          properties: {
            _id: {
              type: 'string'
            },
            user: {
              type: 'string',
              description: 'User ID reference'
            },
            drink: {
              type: 'string',
              description: 'Drink ID reference'
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5'
            },
            comment: {
              type: 'string',
              description: 'User comment/review'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Drinks',
        description: 'Drink management and browsing endpoints'
      },
      {
        name: 'Grades',
        description: 'Rating and review endpoints'
      },
      {
        name: 'Favorites',
        description: 'Favorite drinks management'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'DrinkAdvisor API Docs'
  }));

  // JSON endpoint for Swagger spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};

export default setupSwagger;
