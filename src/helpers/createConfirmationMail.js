const createConfirmationMail = (userEmail, verificationToken) => {
  const mail = {
    to: userEmail,
    subject: 'Kapusta app. Confirm your email',
    html: `<a target='_blank' href='http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}'> <strong> Click on link to confirm your email </strong> </a>`,
  };

  return mail;
};

module.exports = {
  createConfirmationMail,
};
