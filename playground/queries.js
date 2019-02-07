const { mongoose } = require('../config/db');

const { Product } = require('../app/models/product');


// Product.then( data => {
//   console.log(data)
// }).catch(err => {
//   console.log(err)
// })

// Product.find({category:'5b9f5a250490970f709fe066'}).then(data => {
//   console.log(data.length)
// }).catch(err => {
//   console.log(err)
// })

// Product.countDocuments().then(data => {
//   console.log(data)
// })

// Product.where('category').in(['5b9f5a250490970f709fe066','5ba0a3e5bd479b07c0518b27']).then(data => {
//     console.log(data.length)
//   }).catch(err => {
//     console.log(err)
//   })

// Product.where('price').gt(500).then(data => {
//   console.log(data)
// }).catch(err => {
//   console.log(err)
// })

//To find price greater or equal
// Product.where('price').gte(100).then(data => {
//     console.log(data)
//   }).catch(err => {
//     console.log(err)
//   })

// Products greater equal and lessthan and equal
// Product.where('price').gte(1000).lte(2000).then(data => {
//     console.log(data)
//   }).catch(err => {
//     console.log(err)
//   })

// Products greater equal and lessthan and equal and category id
Product.where('price').gte(1000).lte(2000).where('category').in('5ba0a3e5bd479b07c0518b27').then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
