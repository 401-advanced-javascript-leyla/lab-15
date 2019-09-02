'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const swagger = require('./src/swagger.js');

const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
require('./src/app').start(process.env.PORT);
