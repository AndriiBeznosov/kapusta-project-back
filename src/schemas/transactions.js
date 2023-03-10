const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    operation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Transaction = model('transaction', schema);

module.exports = {
  Transaction,
};
