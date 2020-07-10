const autoprefixer = require('autoprefixer')
module.exports = {
  plugins: [
	// 配置css自动加前缀
    autoprefixer({
        overrideBrowserslist: ['> 1%', 'last 4 versions']
    })
  ]
}