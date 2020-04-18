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

// 阿里云access
const aliConfig = require("./ali-iot-consumer.json")
// https://www.jianshu.com/p/41f58f4f23a2
// 阿里云短信
var bodyParser = require('body-parser');
const SMSClient = require('@alicloud/sms-sdk')
//初始化sms_client
const accessKeyId = aliConfig.AccessKeyID;
const secretAccessKey = aliConfig.AccessKeySecret;
let smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey
})

// 接受阿里云物联网数据
const container = require('rhea');
const crypto = require('crypto');


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
    app.get('Device').findOne({'name': content.deviceName}, '_id alarmValue phone', async function(err, device){
        if (err) return handleError(err);
        let alarm = false;
        if (content.items.CurrentTemperature.value >= device.alarmValue) {
            alarm = true;
            
            device.phone.forEach((item) => {
                let param = {
                    code: content.items.CurrentTemperature.value.toString().substr(0,6),
                };
                console.log(param)
                console.log(JSON.stringify(param))
                smsClient.sendSMS({
                    PhoneNumbers: item.phone, //必填:待发送手机号,支持以逗号分隔的形式进行批量调用，目前从前端获取手机号码
                    SignName: aliConfig.SignName,//必填:短信签名-可在短信控制台中找到
                    TemplateCode: aliConfig.TemplateCode,//必填:短信模板-可在短信控制台中找到
                    TemplateParam: JSON.stringify(param) //可选:模板中的变量替换JSON串,目前不用
                }).then(function (res) {
                    let { Code } = res
                    if (Code === 'OK') {
                        //处理返回参数
                        console.log(res)
                    }
                }, function (err) {
                    console.log(err)
                })
            })
        }
        app.get('Record').create({
            deviceId: device._id,
            deviceName: content.deviceName,
            temperature: content.items.CurrentTemperature.value,
            time: new Date(content.items.CurrentTemperature.time).toLocaleString(),
            alarmValue: device.alarmValue,
            alarm: alarm
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