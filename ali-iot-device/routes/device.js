var express = require('express');
var device = require('../device.js');
var router = express.Router();
var deviceObj = {};
deviceObj.device1 = new device('device1')
deviceObj.device2 = new device('device2')
deviceObj.device3 = new device('device3')
deviceObj.device4 = new device('device4')

router.get('/', function(req, res, next) {
  res.send('device');
});

router.get('/open/:n', function(req, res, next) {
  let {n} = req.params;
  deviceObj[n].open()
  res.send(n);
});

router.get('/close/:n', function(req, res, next) {
  let {n} = req.params;
  deviceObj[n].close()
  res.send(n);
});

router.get('/send/:n/:value', function(req, res, next) {
  let {n, value} = req.params;
  deviceObj[n].send(value)
  res.send(n);
});

module.exports = router;
