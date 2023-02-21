const createConfirmationMail = (userEmail, verificationToken) => {
  const mail = {
    to: userEmail,
    subject: 'Kapusta app. Link to confirm your email',
    html: `
    <h3>Our congratulations! You have successfully registered in the Kapusta app!</h3>
    </br><a style="text-decoration:none" target='_blank' href=${process.env.BASE_URL}/api/users/verify/${verificationToken}> <strong> Click on link to confirm your email </strong> </a>
    `,
  };

  return mail;
};

const createLoginInfoMail = (userEmail, password) => {
  const mail = {
    to: userEmail,
    subject: 'Kapusta app. You successfully registered!',
    html: `
        <h3>
        You have successfully registered in the Kapusta app!
        </h3>
        <p> Your password was randomly generated.</p>
        <p>Here is </p>
        <p><strong> LogIn: </strong>${userEmail}</p>
        <p><strong> Password: </strong>${password}.</p>
        <p>
            You can always change your password in the Kapusta app. Authorize with your login and password or login through Google authorization.
        </p>
        <p>
        <strong>Have a good day and Enjoy using it!</strong>
        </p>
    `,
  };

  return mail;
};

module.exports = {
  createConfirmationMail,
  createLoginInfoMail,
};
