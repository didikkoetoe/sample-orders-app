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
    price: 15000000,
    stock: 25,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/laptop-hp.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2xhcHRvcC1ocC5qcGciLCJpYXQiOjE3Njc3MTY1MDgsImV4cCI6MTc5OTI1MjUwOH0.WoGQL8vuR5w8a_4thIClBCux-kxjyZeHu4XCL-KEmTY',
    isActive: true,
  },
  {
    name: 'Wireless Mouse Logitech',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 350000,
    stock: 100,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/mouse.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L21vdXNlLnBuZyIsImlhdCI6MTc2NzcxNjQ5NiwiZXhwIjoxNzk5MjUyNDk2fQ.HnHv4497i3z2iL50o3PNmaXFVqF5R2cCYW3MY_fHCRI',
    isActive: true,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 560000,
    stock: 50,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/keyboard.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2tleWJvYXJkLmpwZyIsImlhdCI6MTc2NzcxNjcxOCwiZXhwIjoxNzk5MjUyNzE4fQ.mJfypDKtXlYjI5mYaCYMMxPGbuGWGVLPovDUlhOoNXw',
    isActive: true,
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 150000,
    stock: 75,
    category: 'Accessories',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/usb-hub.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L3VzYi1odWIuanBnIiwiaWF0IjoxNzY3NzE2ODg5LCJleHAiOjE3OTkyNTI4ODl9.BaIP4XqQTNapPjgVZzTShGXhW3yJprQJgr7NodidBOM',
    isActive: true,
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation',
    price: 700000,
    stock: 30,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/headphone.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2hlYWRwaG9uZS5hdmlmIiwiaWF0IjoxNzY3NzE2OTcyLCJleHAiOjE3OTkyNTI5NzJ9.4rcyafwY1yrZZQAfgObef4-UMx4-n6bvWRZ5o34oF68',
    isActive: true,
  },
  {
    name: 'Webcam HD',
    description: '1080p HD webcam with built-in microphone',
    price: 400000,
    stock: 40,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/webcam.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L3dlYmNhbS5qcGciLCJpYXQiOjE3Njc3MTczMzEsImV4cCI6MTc5OTI1MzMzMX0.si1k_d_NO1iq_eIKQzwlVEAFr80akmLXyfAoYExJ3rM',
    isActive: true,
  },
  {
    name: 'Laptop Stand',
    description: 'Aluminum laptop stand with adjustable height',
    price: 40000,
    stock: 60,
    category: 'Accessories',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/laptop-stand.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2xhcHRvcC1zdGFuZC5qcGciLCJpYXQiOjE3Njc3MTczMjAsImV4cCI6MTc5OTI1MzMyMH0.hk5ocwp5Ts-IjRTCSNKgpZu_XUAaXW_GeitUgn-S-zk',
    isActive: true,
  },
  {
    name: 'External SSD 1TB',
    description: 'Portable SSD with fast transfer speeds',
    price: 900000,
    stock: 45,
    category: 'Storage',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/external-ssd.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2V4dGVybmFsLXNzZC5qcGciLCJpYXQiOjE3Njc3MTcyNjMsImV4cCI6MTc5OTI1MzI2M30.9w82PgoGt15Iq2ZYu1MybyW3OhOxdNx-2DiVcAkgLNs',
    isActive: true,
  },
  {
    name: 'Monitor 27 inch',
    description: '27-inch 4K monitor with HDR support',
    price: 1700000,
    stock: 20,
    category: 'Electronics',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/monitor.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L21vbml0b3IuanBnIiwiaWF0IjoxNzY3NzE3Mjg0LCJleHAiOjE3OTkyNTMyODR9.J-AdliB1It5cXRKPzRWGXSVwZRoZWIYDTBW35vueYQs',
    isActive: true,
  },
  {
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with touch control',
    price: 80000,
    stock: 80,
    category: 'Accessories',
    imageUrl: 'https://xpmosdfasrowejxxtoun.supabase.co/storage/v1/object/sign/product/images.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTZhZGQ2ZS1mMTQ0LTRjNmMtOGY3Yy01MDU0NTUwOTBmYzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0L2ltYWdlcy5qcGciLCJpYXQiOjE3Njc3MTczMDQsImV4cCI6MTc5OTI1MzMwNH0.i1DATaHyu8CpHtrXQQaq_ipOuZB7D62UU4IC3lWy35M',
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
