const mongoose = require('mongoose');
const sh = require('shorthash');
const { User } = require('./user');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderItems: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  total: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['confirm', 'pending', 'cancel']
  }
})


orderSchema.pre('validate', function (next) {
  let order = this;
  order.orderNumber = `DCT-${sh.unique(order.orderDate.toString() + order.user.toString())}`;
  next()
})

orderSchema.pre('save', function (next) {
  let order = this;
  User.findOne({ _id: order.user }).populate('cartItems.product').then(user => {
    user.cartItems.forEach(inCart => {
      let item = {
        product: inCart.product._id,
        quantity: inCart.quantity.quantity,
        price: inCart.product.price
      }
      order.orderItems.push(item);
      order.total += item.quantity * item.price;
      next()
    })
  }).catch(err => {
    return Promise.reject(err);
  })
})


orderSchema.post('save', function (next) {
  let order = this;
  User.findOneAndUpdate({ _id: order.user._id }, { $set: { cartItems: [] } }, { new: true }).then( items => {
    if(items) {
      console.log(items)
    } else {
      console.log('empty')
    }
    next();
  }).catch(err => {
    res.send(err)
  })
})

const Order = mongoose.model('Order', orderSchema);

  module.exports = { Order } 