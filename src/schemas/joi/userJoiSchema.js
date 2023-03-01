const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

const balanceSchema = Joi.object({
  balance: Joi.number().required(),
});

const updateSchema = Joi.object({
  avatarUrl: Joi.string(),
  userName: Joi.string(),
  password: Joi.string().min(6),
});

const updatePasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const passwordVerifySchema = Joi.object({
  password: Joi.string().min(6),
});

module.exports = {
  loginSchema,
  balanceSchema,
  updateSchema,
  updatePasswordSchema,
  refreshTokenSchema,
  passwordVerifySchema,
};
