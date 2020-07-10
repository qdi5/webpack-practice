var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const webpack = require('webpack')
const superagent = require('superagent')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
var indexRouter = require('./routes/index')
var erpRouter = require('./routes/erp')
var app = express();
const CONFIG = require('../build/config')
const env = process.env.NODE_ENV
const isDev = env === 'development'
let webpackConfig = require(`../build/webpack.${env}.config`)
let compiler = webpack(webpackConfig)
global.webpackCompiler = compiler
// 开发环境下才需要启用实时编译和热更新

// 后端项目的运行地址
var baseUrl = global.baseUrl = 'http://192.168.1.179:8001'

// 登录 url、目标url
var url = {
	loginUrl: baseUrl + '/checkLogin',
	targetUrl: baseUrl + '/hbHouse/findAssessAll?houseNo='
}

// 请求设置
var browserMsg = global.browserMsg = {
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
}

var cookie
// 登录erp的用户名密码
var loginMsg = global.loginMsg = {
    pwd: "123456",
    username: "吴哲"
}

// 发送登陆请求，获取 cookie 信息
function getLoginCookie() {
	return new Promise(function(resolve, reject) {
		superagent.post(url.loginUrl).set(browserMsg).send(loginMsg).end(function (err, response) {
		    if (!err) {
		        cookie = response.headers["set-cookie"];
				var redirects = response.redirects
				cookie = redirects[0].split(';')[1]
				global.cookie = cookie
				resolve(cookie)
			} else {
				console.log('报错啦');
				reject(err)
			}
		});
	})
}

getLoginCookie().then(cookie => {
	console.log('获取cookie成功！！！！！！！！！！！！！！！')
}).catch(error => {
	console.error(error)
})

if (isDev) {
    // 用 webpack-dev-middleware 启动 webpack 编译
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        overlay: true,
        hot: true
    }))
    
    // 使用 webpack-hot-middleware 支持热更新
    app.use(webpackHotMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }))
	app.set('view engine', 'ejs')
	app.set('views', path.join(__dirname, './views'))
	// 开发环境下，将client目录设置为静态资源访问路径
	app.use(webpackConfig.output.publicPath, express.static(path.join(__dirname, '../client')))
} else {
	app.set('views', path.join(__dirname, `../${CONFIG.DIR.DIST}`))
	app.use(express.static(path.join(__dirname, `../${CONFIG.DIR.DIST}`)))
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter)
app.use('/erp', erpRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.env.PORT = CONFIG.PORT
module.exports = app;
