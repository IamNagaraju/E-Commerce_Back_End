const express = require('express');

const router = express.Router();
const { categoriesController } = require('../app/controllers/categories_controller');
const { productsController } = require('../app/controllers/products_controller');
const { usersController } = require('../app/controllers/users_controller');
const { cartItemsController } = require('../app/controllers/cart_items_controller');
const { ordersController } = require('../app/controllers/orders_controller');

router.use('/cart_items', cartItemsController);
router.use('/users', usersController);
router.use('/categories', categoriesController);
router.use('/products', productsController);
router.use('/orders' ,ordersController);

module.exports = { router }