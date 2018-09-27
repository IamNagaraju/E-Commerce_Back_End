const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number, 
        required: true, 
        min: 1
        // custom validations
    }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {
    cartItemSchema, 
    CartItem
}