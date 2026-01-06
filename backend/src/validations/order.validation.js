const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          product: Joi.string().custom(objectId).required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object().keys({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    isPaid: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      shippingAddress: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string(),
      }),
      paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'),
      isPaid: Joi.boolean(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
