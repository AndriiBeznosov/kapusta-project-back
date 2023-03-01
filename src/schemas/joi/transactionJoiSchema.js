const Joi = require('joi');

const transactionSchema = Joi.object({
  operation: Joi.string().valid('income', 'expenses').required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.number().required(),
  date: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.string().required(),
  currency: Joi.string().required(),
});

const infoTransactionSchema = Joi.object({
  operation: Joi.string().allow('').optional(),
  category: Joi.string().allow('').optional(),
  month: Joi.string().allow('').optional(),
  year: Joi.string().allow('').optional(),
});

const summaryReportsSchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
});

const categoryReportsSchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
  operation: Joi.string().valid('income', 'expenses').required(),
});

const itemsCategorySchema = Joi.object({
  month: Joi.string().required(),
  year: Joi.string().required(),
  operation: Joi.string().valid('income', 'expenses').required(),
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
