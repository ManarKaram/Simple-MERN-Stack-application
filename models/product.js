const mongoose = require("mongoose");
const _ = require("lodash");

const ProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: "User"
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category"
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      min: 10,
      max: 500
    },
    price: {
      type: Number,
      required: true,
      maxlength: 2
    },
    tags: {
      type: [String],
      maxlength: 10
    },
    discount: {
      type: Number
    },
    imageUrl: {
      type: String
    }
  },
  {
    toJSON: {
      virtuals: true,
      transform: doc => {
        return _.pick(doc, [
          "_id",
          "user",
          "category",
          "name",
          "description",
          "price",
          "tags",
          "discount",
          "imageUrl",
          "createdAt",
          "updatedAt"
        ]);
      }
    }
  }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
