const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const logger = require('../config/logger');
const { User, Product } = require('../models');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
  },
];

const products = [
  {
    name: 'Laptop HP Pavilion',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 899.99,
    stock: 25,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+HP',
    isActive: true,
  },
  {
    name: 'Wireless Mouse Logitech',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 29.99,
    stock: 100,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Mouse',
    isActive: true,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 79.99,
    stock: 50,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Keyboard',
    isActive: true,
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 39.99,
    stock: 75,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x300?text=USB+Hub',
    isActive: true,
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation',
    price: 249.99,
    stock: 30,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
    isActive: true,
  },
  {
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    price: 59.99,
    stock: 40,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Webcam',
    isActive: true,
  },
  {
    name: 'Laptop Stand',
    description: 'Aluminum laptop stand with adjustable height',
    price: 34.99,
    stock: 60,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    isActive: true,
  },
  {
    name: 'External SSD 1TB',
    description: 'Portable SSD with fast transfer speeds',
    price: 119.99,
    stock: 45,
    category: 'Storage',
    imageUrl: 'https://via.placeholder.com/300x300?text=SSD',
    isActive: true,
  },
  {
    name: 'Monitor 27 inch',
    description: '27-inch 4K monitor with HDR support',
    price: 399.99,
    stock: 20,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Monitor',
    isActive: true,
  },
  {
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with touch control',
    price: 45.99,
    stock: 80,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x300?text=Lamp',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    logger.info('Cleared existing data');

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 8),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    logger.info(`Created ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    logger.info(`Created ${createdProducts.length} products`);

    logger.info('Database seeded successfully!');
    logger.info('\nTest Credentials:');
    logger.info('Admin - Email: admin@example.com, Password: password123');
    logger.info('User 1 - Email: john@example.com, Password: password123');
    logger.info('User 2 - Email: jane@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
