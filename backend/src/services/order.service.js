const httpStatus = require('http-status');
const { Order, Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an order
 * @param {Object} orderBody
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody, userId) => {
  const { items, shippingAddress, paymentMethod } = orderBody;

  // Validate products and calculate total
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product ${item.product} not found`);
    }
    if (!product.isActive) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Product ${product.name} is not available`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for product ${product.name}`);
    }

    // Calculate item total
    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // Reduce product stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  return order.populate('items.product user');
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return Order.findById(id).populate('items.product user');
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // If marking as paid, set paidAt timestamp
  if (updateBody.isPaid && !order.isPaid) {
    updateBody.paidAt = new Date();
  }

  // If marking as delivered, set deliveredAt timestamp
  if (updateBody.status === 'delivered' && order.status !== 'delivered') {
    updateBody.deliveredAt = new Date();
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};

/**
 * Get user orders
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getUserOrders = async (userId, options) => {
  return queryOrders({ user: userId }, options);
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getUserOrders,
};
