const express = require('express');
const cors = require('cors')
require('express-async-errors');
require('dotenv').config()
require('./db');

const port = process.env.PORT || 3000;

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products')
const categoryRouter = require('./routes/categories')


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/categories', categoryRouter)
//app.use('/products', productsRouter)


//Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
        res.status(statusCode).json({
            message: "Something went wrong",
            type: "InternalServerError",
            details: []
        });
    } else {
        res.status(statusCode).json({
            message: err.message,
            type: err.type,
            details: err.details
        })
        //console.log(err.message)
    }


})


app.listen(port, () => console.log(`Project app listening at http://localhost:${port}`))