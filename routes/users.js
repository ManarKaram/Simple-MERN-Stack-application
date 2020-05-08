const express = require('express');
const { check, validationResult } = require('express-validator');
const CustomError = require('../helpers/customError');

const User = require('../models/user');
const validationMiddleWare = require('../middlewares/validation')

const router = express.Router();
const authenticationMiddleWare = require('../middlewares/authentication')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({})
        res.json(users)
    }
    catch (err) {
        //console.error(err)
        return next(err);
    }
});

router.post('/register',
    validationMiddleWare(
        check('email').isEmail(),
        check('password')
            .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
            .matches(/\d/).withMessage('must contain a number')
    ),
    async (req, res, next) => {
        debugger

        const { email, password } = req.body;
        const user = new User({
            email, password
        });
        await user.save();
        res.send("Registerd Succefully")
    });

router.post('/login', async (req, res, next) => {


    const { email, password } = req.body;
    // const user = await User.findOne({ username, password }).populate('posts').exec()
    // if (!user) throw new Error("invalid credentials");
    //............................................................................//
    const user = await User.findOne({ email });
    if (!user) {
        throw CustomError(422, "invalid credentials");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw CustomError(422, "Wrong password or email")
    }

    //get the token 
    const token = await user.generateToken();
    res.json({ user, token })
});

router.get('/chat', authenticationMiddleWare, (req, res, next) => {
    res.send('User Token Verified')
})
router.delete('/', authenticationMiddleWare, async (req, res, next) => {
    //  const token = req.headers.authorization;
    //const currentUser = await User.getUserFromToken(token);
    const id = req.user.id;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user);



});

router.patch('/', authenticationMiddleWare,
    validationMiddleWare(
        check('password')
            .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
            .matches(/\d/).withMessage('must contain a number'),
        check('username').isLength({ min: 5 }).withMessage('must be at least 5 chars long')
            .isEmail().withMessage('Password must be an email')
    ),
    async (req, res, next) => {
        const id = req.user.id;
        const { username, password, firstName, age } = req.body;
        const user = await User.findByIdAndUpdate(id, {
            username, password, firstName, age
        }, {
            new: true,
            runValidators: true,
            omitUndefined: true
        });
        res.status(200).json(user);

    });




module.exports = router;