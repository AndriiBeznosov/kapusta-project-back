const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    blackList: {
      type: Array,
      default: [],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const BlackList = model('blackList', schema);

module.exports = {
  BlackList,
};
