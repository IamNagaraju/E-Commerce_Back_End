const express = require('express');
const _= require('lodash');

const router = express.Router();

const { authenticateUser } = require('../middlewares/authentication');
const { authorizeUser } = require('../middlewares/authentication');
const { Category } = require('../models/category');

// To get all the categories
router.get('/',(req,res) => {
  Category.find().then( categories => {
    res.send(categories);
  }).catch(err => {
    res.send(err)
  })
})

router.get('/:id', (req,res) => {
  let id = req.params.id;
  Category.findById(id).then((categories) => {
    res.send(categories);
  }).catch(err => {
    res.send(err)
  })
})

//To post a category
router.post('/', authenticateUser , authorizeUser, (req,res) => {
  let body =_.pick(req.body,['name']);
  let category = new Category(body);
  console.log(category)
  category.save().then( category => {
    // console.log(category)
    res.send(category)
  }).catch(err => {
    res.send(err)
  })
})

// To update for one category
router.put('/:id', authenticateUser,authorizeUser,(req,res) => {
  let id = req.params.id;
  let body =_.pick(req.body,['name']);

  Category.findByIdAndUpdate(id, {$set : body }, {new : true}).then(category => {
    res.send({category,
       notice:'successfully updated'})
  }).catch(err => {
    res.send({notice:'id not found'})
  })
})

// To delete one category
router.delete('/:id',authenticateUser,authorizeUser,(req,res) => {
  let id = req.params.id;
  Category.findOneAndRemove({_id:id}).then((deletedData) => {
    res.send({deletedData,
    notice:'successfully delted'});
  }).catch(err => {
    res.send(err)
  })
})

module.exports = { categoriesController : router }