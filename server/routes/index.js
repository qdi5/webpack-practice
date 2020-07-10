var express = require('express');
var router = express.Router();
var ejs = require('ejs')
var { getTemplate } = require('../common/utils')
const superagent = require('superagent');
const { param } = require('./erp');

/* 查询仪表读数 */
router.get('/hbHouseSale/findbyMeterReadingSale', async function(req, res, next) {
  superagent.get(`${global.baseUrl}/hbHouseSale/findbyMeterReadingSale?houseBillNo=HB190900005`).set("Cookie", global.cookie).set(global.browserMsg).end(function(err, response) {
    if (err) {
    res.json({
      err,
      msg: '查询失败'
    })
  } else {
    console.log('查询仪表读数成功：')
    console.log(response.body)
    res.json(response.body)
  }
})
});

/* 查询物品 */
router.get('/hbHouseSale/findbyGoods', async function(req, res, next) {
  let { houseBillNo, houseType } = req.query
  superagent.get(`${global.baseUrl}/hbHouseSale/findbyGoods?houseBillNo=${houseBillNo}&houseType=${encodeURI(houseType)}`).set("Cookie", global.cookie).set(global.browserMsg).end(function(err, response) {
    if (err) {
    res.json({
      err,
      msg: '查询失败'
    })
  } else {
    console.log('查询物品成功：')
    console.log(response.body)
    res.json(response.body)
  }
})
});

/* 保存资产交割  */
router.post('/hbHouseSale/saveMeteReadGood', async function(req, res, next) {
  const params = req.body
  console.log('接收到的保存参数：',params)
  superagent.post(`${global.baseUrl}/hbHouseSale/saveMeteReadGood`).set("Cookie", global.cookie).set(global.browserMsg).send(params).end(function(err, response) {
    if (err) {
    res.json({
      err,
      msg: '查询失败'
    })
  } else {
    console.log('保存资产交割成功:')
    res.json(response.body)
  }
})
});

// 资产交割提交审批
router.post('/hbHouseSale/saveSysSignedResult', function(req, res, next) {
  const params = req.query
  console.log('提交审批：\r\n', params)
  superagent.post(`${global.baseUrl}/hbHouseSale/saveSysSignedResult`).set("Cookie", global.cookie).set(global.browserMsg).send(params).end(function(err, response) {
    if (err) {
      res.json({
        err,
        msg: '提交审批失败'
      })
    } else {
      console.log('提交审批成功:\r\n', response.body)
      res.json(response.body)
    }
  })
})

module.exports = router;
