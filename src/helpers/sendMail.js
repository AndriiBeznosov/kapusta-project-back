const sendGridMail = require('@sendgrid/mail');

// set API key in the instance from env
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// create sendMail function
// use createConfirmationMail function to crate objConfig

const sendMail = async objConfig => {
  const senderEmail = 'kapusta.confirm@gmail.com';

  const message = { ...objConfig, from: senderEmail };

  try {
    await sendGridMail.send(message);
    console.log(`Mail sended success to ${message.to}`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  sendMail,
};
