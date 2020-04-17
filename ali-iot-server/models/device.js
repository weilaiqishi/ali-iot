const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { 
        type: String,
        unique:true
    },
    description: { type: String },
    alarmValue: { type: Number },
    phone: [{
        name: { type: String },
        phone: { type: String }
    }],
    theMapId: { type: mongoose.SchemaTypes.ObjectId, ref:'TheMap'},
    coordinateX: { type: Number },
    coordinateY: { type: Number },
})

module.exports = mongoose.model('Device',schema)