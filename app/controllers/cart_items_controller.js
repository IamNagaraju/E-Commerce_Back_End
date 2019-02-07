const express = require('express');
const _ = require('lodash');
const { CartItem } = require('../models/cart_item');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const { User } = require('../models/user');
// localhost:3000/cart_items

const router = express.Router();

router.get('/', authenticateUser, (req, res) => {
  let user = req.locals.user;
  // console.log(user)
  res.send(user.cartItems);
});

router.post('/', authenticateUser, (req, res) => {
  let user = req.locals.user;
  let body = _.pick(req.body, ['product', 'quantity']);
  let cartItem = new CartItem(body);
  let item = user.cartItems.find((item) => {
    return item.product.equals(body.product)
  })
  if (item) {
    item.quantity += body.quantity
  } else {
    user.cartItems.push(cartItem);
  }
  user.save().then((user) => {
    res.send({
      cartItem,
      notice: 'successfully added the product to the cart'
    });
  }).catch((err) => {
    res.send(err);
  });
});

router.put('/:id', validateId, authenticateUser, (req, res) => {
  let id = req.params.id;
  let user = req.locals.user;
  let body = _.pick(req.body, ['quantity']);
  let inCart = user.cartItems.id(id);
  if (inCart) {
    Object.assign(inCart, body);
  }
  user.save().then((user) => {
    res.send({
      cartItem: inCart,
      notice: 'successfully updated the cart'
    });
  }).catch(err => {
    res.send(err)
  })
});

//Empty the cart Items
router.delete('/empty', authenticateUser,(req,res) => {
  let user = req.locals.user;
  User.findOneAndUpdate({_id : user._id},{ $set : { cartItems:[]}},{ new : true}).then (() => {
    res.send({
      notice:'cart items empty'
    })
  }).catch(err => {
    res.send(err)
  })
})

router.delete('/:id', validateId, authenticateUser, (req, res) => {
  let user = req.locals.user;
  let id = req.params.id;
  user.cartItems.id(id).remove();
  user.save().then((user) => {
    res.send({
      cartItems: user.cartItems,
      notice: 'successfully remove the product from cart'
    });
  }).catch(err => {
    res.send(err)
  })
});

module.exports = {
  cartItemsController: router
}