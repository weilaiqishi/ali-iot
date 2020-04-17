const express = require("express")
const app = express()

app.use(require('cors')())
app.use(express.json()) //exports.json = bodyParser.json

const Device = require('./models/device')
app.set('Device', Device)
const TheMap = require('./models/theMap')
app.set('TheMap', TheMap)
const Record = require('./models/record')
app.set('Record', Record)

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(4100,()=>{
    console.log('http://localhost:4100');
})

// socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(4101);
io.on('connection', function (socket) {
    console.log('连接成功')
});

// 接受阿里云物联网数据
const container = require('rhea');
const crypto = require('crypto');

const aliConfig = require("./ali-iot-consumer.json")
//Create Connection
var connection = container.connect({
    'host': '1250357125207112.iot-amqp.cn-shanghai.aliyuncs.com',
    'port': 5671,
    'transport':'tls',
    'reconnect':true,
    'idle_time_out':60000,
    'username':`YourClientId|authMode=aksign,signMethod=hmacsha1,timestamp=1573489088171,authId=${aliConfig.AccessKeyID},consumerGroupId=DEFAULT_GROUP|`,
    'password': hmacSha1(aliConfig.AccessKeySecret, `authId=${aliConfig.AccessKeyID}&timestamp=1573489088171`),
});

//Create Receiver Link
var receiver = connection.open_receiver();

//handle received message
container.on('message', function (context) {
    var msg = context.message;
    // var messageId = msg.message_id;
    // var topic = msg.application_properties.topic;
    
    //ACK
    // var ack = context.delivery.accept();
    
    var content = JSON.parse(Buffer.from(msg.body.content).toString());
    app.get('Device').findOne({'name': content.deviceName}, '_id', function(err, device){
        if (err) return handleError(err);
        app.get('Record').create({
            deviceId: device._id,
            deviceName: content.deviceName,
            temperature: content.items.CurrentTemperature.value,
            time: new Date(content.items.CurrentTemperature.time).toLocaleString()
        }).then((resolve)=>{
            resolve.deviceName = content.deviceName;
            io.emit('record',{record:resolve})
            console.log(resolve);
        })
    })
});

//calculate password
function hmacSha1(key, context) {
    return Buffer.from(crypto.createHmac('sha1', key).update(context).digest())
        .toString('base64');
}