'use strict';

/**
 * User Model
 * @module src/users-model
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usedToken = [];



const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
});

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(console.error);
});

/**
 *This checks if the user is in the database
 *
 * @param {email}
 * @returns {object} user information
 */

users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch( error => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

/**
 *This checks for the user name
 *
 * @param {auth}
 * @returns {object} user information
 */

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

/**
 *This checks for the token
 *
 * @param {token}
 * @returns {object} user information
 */

users.statics.authenticateToken = function(token){
  const decryptedToken = jwt.verify(token, process.env.SECRET || 'secret');

  if(!usedToken.includes(token)){
    usedToken.push(token);
  }else{
    console.log('this token has been used once');
    return Promise.reject('invalid token');
  }
  const query = {_id: decryptedToken.id};
  return this.findOne(query);
};

/**
 *This compares the input password and the password in database
 *
 * @param {password}
 * @returns {object} user information
 */

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

/**
 *This generates a new token
 *
 * @returns {object} token
 */

users.methods.generateToken = function() {
  let options = {
    expiresIn: '1m',
  };

  let token = {
    id: this._id,
    role: this.role,
  };

  return jwt.sign(token, process.env.SECRET, options);
};

module.exports = mongoose.model('users', users);

