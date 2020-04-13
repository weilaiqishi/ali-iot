const crypto = require('crypto');
const mqtt = require('mqtt');

function getPostData() {
    const payloadJson = {
        id: Date.now(),
        params: {
            CurrentTemperature: Math.floor((Math.random() * 10) + 20),
        },
        method: "thing.event.property.post"
    }
    return JSON.stringify(payloadJson);
}

function signHmacSha1(options, deviceSecret) {
    let keys = Object.keys(options).sort();
    // 按字典序排序
    keys = keys.sort();
    const list = [];
    keys.map((key) => {
        list.push(`${key}${options[key]}`);
    });
    const contentStr = list.join('');
    return crypto.createHmac('sha1', deviceSecret).update(contentStr).digest('hex');
}

const deviceConfigObj = require("./iot-device-config.json");
class device{
    constructor(name){
        this.interval = null;
        this.deviceConfig = deviceConfigObj[name]
        this.options = {
            productKey: this.deviceConfig.productKey,
            deviceName: this.deviceConfig.deviceName,
            timestamp: Date.now(),
            clientId: Math.random().toString(36).substr(2)
        }
        this.options.password = signHmacSha1(this.options, this.deviceConfig.deviceSecret);
        this.options.clientId = `${this.options.clientId}|securemode=3,signmethod=hmacsha1,timestamp=${this.options.timestamp}|`;
        this.options.username = `${this.options.deviceName}&${this.options.productKey}`;
        this.url = `tcp://${this.options.productKey}.iot-as-mqtt.${this.deviceConfig.regionId}.aliyuncs.com:1883`;
        //建立连接
        this.client = mqtt.connect(this.url, this.options);
        //属性上报的Topic
        this.topic = `/sys/${this.deviceConfig.productKey}/${this.deviceConfig.deviceName}/thing/event/property/post`;
    }

    open(){
        this.close();
        let that = this;
        this.interval = setInterval(function () {
            //发布数据到topic
            that.client.publish(that.topic, getPostData());
        }, 5 * 1000);
        return that;
    }

    close(){
        if(!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
    }

    send(value){
        this.client.publish(this.topic, JSON.stringify({
            id: Date.now(),
            params: {
                CurrentTemperature: Math.floor(value),
            },
            method: "thing.event.property.post"
        }));
    }
}

module.exports = device;