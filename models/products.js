const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
  categories: {
    type: String,
  },
  weight: {
    type: Number,
  },
  title: {
    type: String,
  },
  calories: {
    type: Number,
  },
  groupBloodNotAllowed: {
    type: [Boolean], 
    required: true
  }
}, {
  versionKey: false,
  timestamps:true
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
