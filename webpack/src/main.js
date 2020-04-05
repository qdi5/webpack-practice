import './css/main.css'
import { add } from './app.js'
console.log(12)
function a() {
  console.log('hahaha')
}
function b() {
  const btn = document.createElement('button')
  btn.innerHTML = '新增按钮'
  document.body.appendChild(btn)
  btn.onclick = function() {
    const div = document.createElement('div')
    div.innerHTML = "hahaha";
    document.body.appendChild(div);
  }
}
b()
add()