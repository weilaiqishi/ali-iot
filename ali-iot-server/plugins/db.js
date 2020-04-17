module.exports = app =>{
    const mongoose = require("mongoose")
    mongoose.connect('mongodb://localhost:127.0.0.1:27017/aliFire',{
        useNewUrlParser: true,
    })

    // require('require-all')(__dirname + '/../models')
}