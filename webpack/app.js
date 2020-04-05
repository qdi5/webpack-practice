// 使用垫片脚本实现es6的内置功能（如Promise,）
// import "@babel/polyfill" (When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
// Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.)
import './main.css'
import CSS from  './app.scss'
import './fonts/iconfont.css'

console.log('CSS', CSS)
const a = 1
let b =2
var c = () => 2
const arr = [new Promise(() => {}), new Promise(() => {})]
arr.map(item => {
  console.log(item)
})

function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(250);
    }, 2000);
  })
}
async function data() {
  let result = await getData()
  console.log(result)
}
data()
import oneImage from './one.jpg'
var img = new Image()
img.src = oneImage;
var dom = document.getElementById("app");
dom.classList.add(CSS.avatar);
dom.append(img)
console.log(oneImage);