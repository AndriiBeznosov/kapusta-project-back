const Joi = require('joi');

const transactionSchema = Joi.object({
  operation: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.number().required(),
  date: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.string().required(),
  userId: Joi.string(),
});

const infoTransactionSchema = Joi.object({
  operation: Joi.string().required(),
  category: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.string().required(),
});

const summaryReportsSchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
});

const categoryReportsSchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
  operation: Joi.string().required(),
});
const itemsCategorySchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
  operation: Joi.string().required(),
  category: Joi.string().required(),
});

const operationSchema = Joi.object({
  operation: Joi.string().valid('income', 'expenses').required(),
});

module.exports = {
  operationSchema,
  transactionSchema,
  summaryReportsSchema,
  categoryReportsSchema,
  itemsCategorySchema,
  infoTransactionSchema,
};
