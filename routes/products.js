const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const authenticationMiddleware = require("./../middlewares/authentication");
const ownerAuthorization = require("./../middlewares/ownerAuthorization");
const CustomError = require("../helpers/customError");

//get products of specified user
router.get(
  "/user-products",
  authenticationMiddleware,
  async (req, res, err) => {
    debugger;
    const userId = req.user.id;
    const userProducts = (await Product.find()).filter(
      item => item.user.toString() === userId
    );
    res.json(userProducts);
  }
);

router.post("/add-product", authenticationMiddleware, async (req, res, err) => {
  //debugger;
  const user = req.user.id;
  const {
    name,
    description,
    price,
    category,
    discount,
    imageUrl,
    tags
  } = req.body;
  console.log(user);
  const product = new Product({
    user,
    name,
    description,
    price,
    category,
    discount,
    imageUrl,
    tags
  });
  console.log(product);
  await product.save();
  res.json(product);
});

router.patch(
  "/edit-product/:id",
  authenticationMiddleware,
  ownerAuthorization,
  async (req, res, next) => {
    const id = req.params.id;
    const user = req.user.id;

    const { name, description, price, category, tags, discount } = req.body;
    const productToEdit = await Product.findByIdAndUpdate(
      id,
      { user, name, description, price, category, tags, discount },
      {
        new: true,
        runValidators: true,
        omitUndefined: true
      }
    );
    res.status(200).json(productToEdit);
  }
);

router.delete(
  "/delete-product/:id",
  authenticationMiddleware,
  ownerAuthorization,
  async (req, res, next) => {
    const id = req.params.id;
    debugger;
    const product = await Product.findByIdAndDelete(id);
    res.json(product);
  }
);

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("category");
  res.json({ product: product, category: product.category.name });
});

/////////////////////////////////.................One Route .............//////////////////////

router.get("", async (req, res, err) => {
  let searchedCategory = req.query.category ? req.query.category : "";
  let searchedItems = req.query.item ? req.query.item : "";
  let orderKey = req.query.orderKey ? req.query.orderKey : "";
  let products = [];
  let currentPage = req.query.currentPage ? req.query.currentPage : 1;
  const pageSize = 6;

  //get ALL products
  //http://localhost:3000/products
  if (searchedCategory === "" && searchedItems === "") {
    products = await Product.find({}).populate("category");
  }

  //get all products of specified category
  //http://localhost:3000/products?category=5e98a91411bedd48850ada27
  else if (searchedCategory && searchedItems === "") {
    debugger;
    products = await Product.find({ category: searchedCategory }).populate(
      "category"
    );
  }

  //search in All products
  //http://localhost:3000/products?item=a
  else if (searchedCategory === "" && searchedItems) {
    products = await Product.find({
      name: {
        $regex: new RegExp(".*" + searchedItems.toLocaleLowerCase() + ".*")
      }
    });
  }

  //search in specified category
  //http://localhost:3000/products?item=cm&category=women shoes
  else if (searchedCategory && searchedItems) {
    products = await Product.find({
      category: searchedCategory,
      name: {
        $regex: new RegExp(".*" + searchedItems.toLocaleLowerCase() + ".*")
      }
    });
  }

  //sort by name
  if (orderKey === "name") {
    products = products.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  //http://localhost:3000/products?item=cm&category=women shoes&orderKey=lowPrice
  else if (orderKey === "lowPrice") {
    products = products.sort((a, b) => (a.price > b.price ? 1 : -1));
  } else if (orderKey === "highPrice") {
    debugger;
    products = products.sort((a, b) => (a.price > b.price ? -1 : 1));
  }
  let productsLength = products.length;
  const startIndex = (currentPage - 1) * pageSize;
  products = _(products)
    .slice(startIndex)
    .take(pageSize)
    .value();

  res.json({
    products: products,
    pageSize: pageSize,
    productsLength: productsLength
  });
});
//////...............................
module.exports = router;
