# express + webpack + nodemon实现node代码和前端代码自动更新

## 启动
`npm i`安装依赖
`npm run dev`开发环境下启动项目
`npm run build`生产环境下打包项目，输出js、css、fonts、img、html等文件

## 此项目存在的问题
1. 生成的是ejs文件，能否自定义后缀名？
2. build打包后的静态资源路径不正确
3. 不能动态设置后端服务器的地址
4. 未配置eslint

## 知识点
1. node的glob模块的用法

