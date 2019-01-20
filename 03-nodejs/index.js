'use strict';

console.log(`
3.
---

We need to create a route that downloads the entire database to a .csv file.
The endpoint must be set to: GET /users

Make sure to have an instance of MongoDB running at: mongodb://localhost

Run the database seed with:
$ node utils/seed.js

-> Warning: It contains hundreds of entities and our production server is quite small
`);

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Setup database
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/mediastream-challenge');
const User = require('./models/User');

// Setup Express.js app
const app = express();
// TODO

app.use(morgan('tiny'));

app.get('/users', async (req, res) => {
  const usersData = await User.find().select('_id name email');
  const data = [
    ['ID', 'Name', 'Email'],
    ...usersData.map(({ _id, name, email }) => [_id, name, email])
  ];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/csv');
  data.forEach(item => {
    res.write(item.map(field => {
      return '"' + field.toString().replace(/\"/g, '""') + '"';
    }).toString() + '\r\n');
  });
  res.end();
});

app.listen(3000);
