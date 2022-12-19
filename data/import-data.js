const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const Item = require('../models/itemModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const items = JSON.parse(fs.readFileSync(`${__dirname}/items.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Item.create(items);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Item.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
