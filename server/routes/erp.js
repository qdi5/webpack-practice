var express = require('express');
var router = express.Router();
var ejs = require('ejs')
var { getTemplate } = require('../common/utils')
var { join } = require('path')
var CONFIG = require('../../build/config')
/*
router.get('/:page', (req, res, next) => {
	debugger
	const HTML_FILE = join(global.webpackCompiler.outputPath, `/${CONFIG.DIR.VIEW}/${req.params.page}.ejs`)
	global.webpackCompiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
		debugger
		if (err) {
		  return next()
		}
		res.set('content-type', 'text/html')
		res.send(result)
		res.end()
	})
})*/

// erp所有的页面都走这个路由

router.get('/:page', async function(req, res, next) {
  const tmplName = req.params.page
  try {
	  const template = await getTemplate(`${tmplName}.ejs`) // 获取 ejs 模板文件
	  let html = ejs.render(template, { title: `${tmplName}`, publicPath: '/public' })
	  res.send(html)
  } catch (e) {
	  next(e)
  }
});

module.exports = router
