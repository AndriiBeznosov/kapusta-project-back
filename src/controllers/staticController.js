const path = require('path');

const staticController = (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../', 'public', 'link.html'));
};

module.exports = {
  staticController,
};
