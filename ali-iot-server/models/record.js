const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    deviceId: { type: mongoose.SchemaTypes.ObjectId, ref:'Device'},
    deviceName: { type: String },
    temperature: { type: Number },
    time: { type: String }
})

module.exports = mongoose.model('Record',schema)