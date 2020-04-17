const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { 
        type: String,
        unique:true
    },
    description: { type: String },
    sizeX: { type: Number },
    sizeY: { type: Number },
    point: [{
        coordinateX: { type: Number },
        coordinateY: { type: Number },
        name: { type: String },
        color: { type: String },
    }]
})

schema.virtual('deviceList',{
    localField: '_id',
    foreignField: 'theMapId',
    justOne: false,
    ref: 'Device'
})

module.exports = mongoose.model('TheMap',schema)