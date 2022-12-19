const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ❗️', err.name, err.message, err);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION ❗️', err.name, err.message);
  server.close(() => process.exit(1));
});
