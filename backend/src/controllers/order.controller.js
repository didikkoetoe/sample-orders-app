const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'isPaid']);

  // If user is not admin, only show their orders
  if (req.user.role !== 'admin') {
    filter.user = req.user.id;
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'items.product,user';
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Users can only see their own orders, admins can see all
  if (req.user.role !== 'admin' && order.user.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Users can only update their own orders, admins can update all
  if (req.user.role !== 'admin' && order.user.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const updatedOrder = await orderService.updateOrderById(req.params.orderId, req.body);
  res.send(updatedOrder);
});

const deleteOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Users can only delete their own orders, admins can delete all
  if (req.user.role !== 'admin' && order.user.id !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMyOrders = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'items.product';
  const result = await orderService.getUserOrders(req.user.id, options);
  res.send(result);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
};
