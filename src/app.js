const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const usersTransaction = require('./routes/transactions');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transaction', usersTransaction);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
