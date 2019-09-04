'use strict';

const {server} = require('../../../src/app');
// const {server2} = require('../../../src/app.js');
const supergoose = require('../../supergoose');
const mockRequest = supergoose.server(server);
// const mockRequest2 = supergoose.server(server2);

process.env.SECRET='test';

const jwt = require('jsonwebtoken');

let users = {
  user: {username: 'ian', password: 'ian', role: 'user'},
};

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Products API', () => {

  let encodedToken;
  // let id;

  it('can create one', () => {
    return mockRequest.post('/signup')
      .send(users.user)
      .then(results => {
        var token = jwt.verify(results.text, process.env.SECRET);
        // id = token.id;
        encodedToken = results.text;
        expect(token.id).toBeDefined();
      });
  });

  it('Getting all the products data from and return 201', () => {
    const testProduct = {
      name: 'fish',
      description: 'There are some fish',
      quantity: 100,
    };

    return mockRequest.post('/api/v1/products')
      .send(testProduct)
      .set('Authorization', 'Bearer ' + encodedToken)
      .then(()=>{
        return mockRequest.get('/api/v1/products');
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.count).toEqual(1);
      });
  });

  it('Getting the product with the id from request params and return 200', () => {
    const testProduct = {
      name: 'durian',
      description: 'There are some durian',
      quantity: 15,
    };

    return mockRequest.post('/api/v1/products')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testProduct)
      .then((result)=>{
        // console.log(result);
        return (mockRequest.get(`/api/v1/products/${result.body._id}`));
      })

      .then(response => {
        // console.log(response);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testProduct.name);
      });
  });

  it('Creating a new product should return 201 and the created object', () => {
    const testProduct = {
      name: 'fish',
      description: 'There are some fish',
      quantity: 100,
    };

    return mockRequest.post('/api/v1/products')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testProduct)
      .then(response => {
        // console.log('got in create test for product',response);
        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual('fish');
      });
  });

  it('Updating a product with the id from params and the request.body and return 200',()=>{
    const testProduct = {
      name: 'flowers',
      description: 'There are some flower',
      quantity: 20,
    };

    const updateProduct = {
      name: 'flowers',
      description: 'There are some flower',
      quantity: 30,
    };

    return mockRequest.post('/api/v1/products')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testProduct)
      .then(result=>{
        return (mockRequest.put(`/api/v1/products/${result.body._id}`))
          .set('Authorization', 'Bearer ' + encodedToken)
          .send(updateProduct);
      })

      .then(response=>{
        // console.log('this is in the putProduct test, response:', response);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testProduct.name);
      });
  });

  it('Deleting a product with the id from params and return 200',()=>{
    const testProduct = {
      name: 'sushi',
      description: 'There are some sushi',
      quantity: 20,
    };
    return mockRequest.post('/api/v1/products')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testProduct)
      .then(result=>{
        return (mockRequest.delete(`/api/v1/products/${result.body._id}`))
          .set('Authorization', 'Bearer ' + encodedToken);
      })

      .then(response=>{
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testProduct.name);
      });

  });

  // tests for categories

  it('Getting all the category data from and return 201', () => {
    const testCategory = {
      name: 'dog',
      description: 'There are some dogs',
    };

    return mockRequest.post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testCategory)
      .then(()=>{
        return mockRequest.get('/api/v1/categories');
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.count).toEqual(1);
      });
  });



  it('Getting the category with the id from request params and return 200', () => {
    const testCategory = {
      name: 'sushi',
      description: 'There are some sushi',
    };

    return mockRequest.post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testCategory)
      .then((result)=>{
        return (mockRequest.get(`/api/v1/categories/${result.body._id}`));
      })

      .then(response => {
        // console.log(response);
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testCategory.name);
      });
  });

  it('Creating a new category should return 201 and the created object', () => {
    const testCategory = {
      name: 'fish',
      description: 'There are some fish',
    };

    return mockRequest.post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testCategory)
      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual('fish');
      });
  });

  it('Updating a category with the id from params and the request.body and return 200',()=>{
    const testCategory = {
      name: 'flowers',
      description: 'There are some flower',
    };

    const updateCategory = {
      name: 'flowers',
      description: 'There are some flowers here',
    };

    return mockRequest.post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testCategory)
      .then(result=>{
        return (mockRequest.put(`/api/v1/categories/${result.body._id}`)).send(updateCategory)
          .set('Authorization', 'Bearer ' + encodedToken);
      })

      .then(response=>{
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testCategory.name);
      });
  });

  it('Deleting a category with the id from params and return 200',()=>{
    const testCategory = {
      name: 'sushi',
      description: 'There are some sushi',
    };
    return mockRequest.post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + encodedToken)
      .send(testCategory)
      .then(result=>{
        return (mockRequest.delete(`/api/v1/categories/${result.body._id}`))
          .set('Authorization', 'Bearer ' + encodedToken);
      })

      .then(response=>{
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(testCategory.name);
      });

  });

});

