# LAB - 13

## Bearer Authorization

### Author: Leyi Li


### Links and Resources
* [submission PR](https://github.com/401-advanced-javascript-leyla/lab-15/pulls)
* [travis](https://www.travis-ci.com/401-advanced-javascript-leyla/lab-15)
* [heroku](https://lab-15-leyla.herokuapp.com/)

#### Documentation
* [jsdoc](http://localhost:3000/docs/) 
* [swagger](http://localhost:3333/api-docs)

### Modules
#### `users-model.js`
##### Exported User Schema and methods (createFromOauth(), authenticateBasic(), comparePassword(), generateToken())
#### `mongo.js`
#### `products.js`
#### `categories.js`

### Setup
#### `.env` requirements
* `PORT` - 3000
* `SWAGGER PORT` - 3333

#### Running the app
* `npm install`
* `npm start`
* Endpoint: `/signup`
  * Creates a new user and saves it to database
* Endpoint: `/signin`
  * Validates the user and append cookie to response.
  * Endpoint: `/oauth`
  * sends token to response
* Endpoint: `/api/v1/categories`
  * Returns a JSON object with categories data in it.
* Endpoint: `/api/v1/products`
  * Returns a JSON object with products in it.
  
#### Tests
* `npm run test`


