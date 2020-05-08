const Product = require('../models/product')
const CustomError = require('../helpers/customError');
module.exports = async (req, res, next) => {
    //try {
    const { params: { id: productId }, user: { id: userId } } = req;

    const product = await Product.findById(productId);
    if (!product.user.equals(userId)) {
        const err = new CustomError(403, "Not Authorized");
        err.statusCode = 403;
        throw err;
    }
    next();
    // } catch (err) {
    //     next(err)
    // }

}