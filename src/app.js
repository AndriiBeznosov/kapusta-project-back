const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const usersTransaction = require('./routes/transactions');

// add routes for static html page with test link & google auth routes
const staticRouter = require('./routes/static');
const authGoogleRouter = require('./routes/authGoogle');

const { upload } = require('./helpers/storegMulter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//  /api/link - test html page vs link jo GoogleAuth
app.use('/api', staticRouter);
app.use('/', authGoogleRouter);

app.use('/api/users', usersRouter);
app.use('/api/transaction', usersTransaction);

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
