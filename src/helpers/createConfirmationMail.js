const { HttpError } = require('../httpError');
const {
  createConfirmationMail,
  passwordUpdateEmail,
} = require('../helpers/createMail');
const { sendMail } = require('../helpers/sendMail');

const sendMailConfirmationMail = async user => {
  try {
    const mail = await createConfirmationMail(
      user.email,
      user.verificationToken
    );
    await sendMail(mail);
  } catch (error) {
    throw new HttpError('Sending a letter did not pass verification', 404);
  }
};

const SendMailUpdatingPassword = async (email, password) => {
  try {
    const mail = await passwordUpdateEmail(email, password);
    await sendMail(mail);
  } catch (error) {
    throw new HttpError('Sending a letter did not pass verification', 404);
  }
};

module.exports = {
  sendMailConfirmationMail,
  SendMailUpdatingPassword,
};
