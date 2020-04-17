const container = require('rhea');
const crypto = require('crypto');

//Create Connection
var connection = container.connect({
    'host': '1250357125207112.iot-amqp.cn-shanghai.aliyuncs.com',
    'port': 5671,
    'transport':'tls',
    'reconnect':true,
    'idle_time_out':60000,
    'username':'YourClientId|authMode=aksign,signMethod=hmacsha1,timestamp=1573489088171,authId=AccessKeyID,consumerGroupId=DEFAULT_GROUP|',
    'password': hmacSha1('AccessKeySecret', 'authId=AccessKeyID&timestamp=1573489088171'),
});

//Create Receiver Link
var receiver = connection.open_receiver();

//handle received message
container.on('message', function (context) {
    var msg = context.message;
    var messageId = msg.message_id;
    var topic = msg.application_properties.topic;
    var content = Buffer.from(msg.body.content).toString();

    //ACK
    var ack = context.delivery.accept();
    console.log(content)
    console.log('\n\n\n')
});

//calculate password
function hmacSha1(key, context) {
    return Buffer.from(crypto.createHmac('sha1', key).update(context).digest())
        .toString('base64');
}