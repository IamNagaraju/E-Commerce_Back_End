const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { Product } = require('../models/product');

const { authenticateUser } = require('../middlewares/authentication');
const { authorizeUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
// get all products
// localhost:3000/products/
router.get('/', (req, res) => {
  Product.find().populate('category').then((products) => {
    res.send(products);
  }).catch((err) => {
    res.send(err);
  });
});

router.get('/:id', (req,res) => {
  Product.findById(req.params.id).then(product => {
    res.send(product)
  }).catch(err => {
    res.send(err)
  })
})

router.post('/', authenticateUser,authorizeUser,(req, res) => {
  // strong parameters
  let body = _.pick(req.body, ['name', 'price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);
  let product = new Product(body);
  product.save().then((product) => {
    res.send({
      product,
      notice: 'successfully created product'
    });
  }).catch((err) => {
    res.send(err);
  });
});

router.put('/:id',validateId,authenticateUser,authorizeUser, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'price', 'description', 'category', 'codEligible', 'stock', 'maxUnitPurchase', 'lowStockAlert']);

  // 1st approach, find the record, update it and then save(). advantage; in custom validator this will refer to the object; 
  Product.findById(id).then((product) => {
    Object.assign(product, body);
    return product.save()
  }).then((product) => {
    res.send(product);
  }).catch((err) => {
    res.send(err);
  });

  // 2nd approad, find and update using Model.findByIdAndUpdate(). advantage: you are not bringing the object back into memory, disadvantage is this will refer the the class
  // Product.findByIdAndUpdate(id, { $set: body}, { new: true, runValidators: true, context: 'query'}).then((product) => {
  //     res.send(product);
  // }).catch((err) => {
  //     res.send(err); 
  // });

});

module.exports = {
  productsController: router
}