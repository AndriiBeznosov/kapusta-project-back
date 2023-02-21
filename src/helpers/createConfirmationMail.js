const createConfirmationMail = (userEmail, verificationToken) => {
  const mail = {
    to: userEmail,
    subject: 'Kapusta app. Confirm your email',
    html: `<div>
    <a target='_blank' href=${process.env.SERVER_URL}/api/users/verify/${verificationToken}> <strong> Click on link to confirm your email </strong> </a></div>`,
  };

  return mail;
};

module.exports = {
  createConfirmationMail,
};
