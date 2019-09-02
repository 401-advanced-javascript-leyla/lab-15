'use strict';

/**
 * User Model
 * @module src/users-model
 */
const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {
    let [authType, authString] = req.headers.authorization.split(/\s+/);

    switch( authType.toLowerCase() ) {
    case 'basic':
      return _authBasic(authString);
    case 'bearer':
      return _authBearer(authString);
    default:
      return _authError();
    }
  }
  catch(e) {
    next(e);
  }

  /**
   *This function check if the user exists in the db by username and password
   *
   * @param {string} str
   * @returns {object} user
   */
  function _authBasic(str) {
    // str: am9objpqb2hubnk=
    let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
    let auth = {username,password}; // { username:'john', password:'mysecret' }

    return User.authenticateBasic(auth)
      .then(user => _authenticate(user) )
      .catch(next);
  }



  /**
   *This function check if the user exists in the db by checking its token
   *
   * @param {string} authString
   * @returns {object} user
   */
  function _authBearer(authString){
    return User.authenticateToken(authString)
      .then(user => _authenticate(user))
      .catch(next);
  }



  /**
   *This function append token to req
   *
   * @param {object} user
   */
  function _authenticate(user) {
    if(user) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }


  /**
   *This function run if there is an error and pass the invalid message to response
   *
   */
  function _authError() {
    next('Invalid User ID/Password');
  }

};
