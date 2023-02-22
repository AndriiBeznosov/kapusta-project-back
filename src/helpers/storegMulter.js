const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    cd(null, 'uploads');
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = {
  upload,
};
