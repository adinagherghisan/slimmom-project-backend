const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const Products = require('./models/products');

const connect = process.env.MONGODB_CONNECTION;

mongoose.connect(connect)
  .then(() => {
      console.log("MongoDB connected successfully!");
      
      Products.find({})
          .then(docs => {
              console.log("Documents found:", docs.length);
        
              const port = process.env.PORT || 3000;
              app.listen(port, () => {
                  console.log(`Server running on port ${port}`);
              });
          })
          .catch(
              err => console.error("Error finding documents:", err));
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
