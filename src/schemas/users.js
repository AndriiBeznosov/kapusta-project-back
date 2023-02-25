const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/[a-z0-9]+@[a-z0-9]/, 'user email is not valid'],
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    firstVisit: {
      type: Boolean,
      default: false,
    },
    firstBalance: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model('user', schema);

module.exports = { User };
