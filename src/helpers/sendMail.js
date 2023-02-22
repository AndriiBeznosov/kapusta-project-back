const sendGridMail = require('@sendgrid/mail');
const { HttpError } = require('../httpError');

// set API key in the instance from env
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// create sendMail function
// use createConfirmationMail function to crate objConfig

const sendMail = async objConfig => {
  const senderEmail = 'kapusta.confirm@gmail.com';

  const message = { ...objConfig, from: senderEmail };

  try {
    await sendGridMail.send(message);
  } catch (error) {
    throw new HttpError('Do not verified email', 401);
  }
};

module.exports = {
  sendMail,
};
