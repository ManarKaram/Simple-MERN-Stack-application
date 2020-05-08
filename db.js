const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexes: true }).then(() => {
        console.log("db connected")
    }).catch((err) => {
        console.log(err);
    });
module.exports = mongoose;



