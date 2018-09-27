const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/E-commerce-backend',{useNewUrlParser:true}).then(() => {
  console.log('connect to db')
}).catch(err => {
  console.log(err)
})

mongoose.set('useCreateIndex',true);

module.exports = { mongoose }