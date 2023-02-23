const createName = email => {
  const indexEmail = email.indexOf('@');
  const name = email.slice(0, indexEmail).slice(0, 9);
  return name;
};
module.exports = {
  createName,
};
