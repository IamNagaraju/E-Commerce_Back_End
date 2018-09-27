const express = require('express');
const _ = require('lodash')
// const { cartItemsController } = require('./cart_items_controller');
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { authenticateUser } = require('../middlewares/authentication');
const { validateId } = require('../middlewares/utilities');
const { User } = require('../models/user');

const router = express.Router();

router.get('/', authenticateUser, (req, res) => {
  let user = req.locals.user;
  Order.find({ user: user._id }).then((orders) => {
    res.send(orders)
  }).catch(err => {
    res.send(err)
  })
})

router.post('/', authenticateUser, (req, res) => {
  let user = req.locals.user;
  let order = new Order();

  order.user = user._id;
  order.save().then(order => {
    res.send({
      order,
      notice: 'successully created'
    })
  }).catch(err => {
    res.send(err)
  })

})

// router.post('/', authenticateUser, (req,res) => {
// let user = req.locals.user;
// let body =_.pick(req.body,['orderNumber']);
// let order = new Order(body);
// // console.log(user)
// //  order.orderItems.push(req.locals.user.cartItems[0])
// order.user = req.locals.user._id
//  let item = req.locals.user.cartItems;
//  let total1 =0;
//  Product.find().then(products => {
//   item.forEach( items => {
//       products.forEach( product => {
//         if(items.product.equals(product._id)) {
//          total1 += product.price* items.quantity
//         }
//      })
//    })
//   item.forEach( item => {
//     order.orderItems.push(item)
//   })
//   order.total = total1;

//    order.save().then(user => {
//      if(user.orderItems.length>0) {
//       User.findOneAndUpdate({_id : req.locals.user._id},{ $set : {cartItems:[]}},{ new : true}).then(result => {
//         console.log('empty')
//        })
//        res.send(user)
//      } else {
//        res.send('cart is empty')
//      }
//    }).catch(err => {
//      res.send(err)
//    })
//  })
// })


module.exports = { ordersController: router }