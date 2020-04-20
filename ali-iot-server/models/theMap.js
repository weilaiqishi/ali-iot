const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { 
        type: String,
        unique:true
    },
    description: { type: String },
    image: { type: String },
    sizeX: { type: Number },
    sizeY: { type: Number },
    point: { type: String }
},{ toJSON: { virtuals: true } })

schema.virtual('deviceList',{
    localField: '_id',
    foreignField: 'theMapId',
    justOne: false,
    ref: 'Device'
})

module.exports = mongoose.model('TheMap',schema)