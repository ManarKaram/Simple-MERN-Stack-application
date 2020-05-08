const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category')
const validationMiddleWare = require('../middlewares/validation')

const router = express.Router();
const authenticationMiddleWare = require('../middlewares/authentication')


///..........................get all categories .................////

router.get('/', async (req, res, err) => {
    const categories = await Category.find({})
    res.json(categories)
})


////....................... get all products of category .............../////////
router.get('/products/:id',
    async (req, res, err) => {
        debugger;
        const categoryId = req.params.id;
        const catProd = await Product.find();
        const one = catProd[0].category
        const categoryProducts = (await Product.find())
            .filter(item => (item.category).toString() === categoryId)
        res.json(categoryProducts);
    })



module.exports = router;