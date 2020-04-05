// 使用垫片脚本实现es6的内置功能（如Promise,）
// import "@babel/polyfill" (When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
// Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.)
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
var dom = document.getElementById("images");
dom.append(img)
console.log(oneImage);