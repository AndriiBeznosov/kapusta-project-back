require('dotenv').config();

const app = require('./src/app');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const { URL_DB_MONGODB, PORT } = process.env;

(async function () {
  try {
    const connection = await mongoose.connect(URL_DB_MONGODB);
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('SERVER CONECTION ERROR: ', error.message);

    process.exit(1);
  }
})()
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(err =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
