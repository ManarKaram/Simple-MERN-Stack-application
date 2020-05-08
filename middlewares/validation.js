const { validationResult } = require('express-validator')
const CustomError = require('../helpers/customError');
require('express-async-errors');


module.exports = (...validationChecks) =>
    async (req, res, next) => {
        //try {
        await Promise.all(
            validationChecks.map(
                validationCheck => validationCheck.run(req)
            )
        );
        const { errors } = validationResult(req);
        if (!errors.length) {
            return next();
        }
        throw CustomError(422, "Validation Error", errors)


    }