import './css/main.css'
import { add } from './app.js'
import axios from 'axios'
import _ from 'lodash'
function add2(a, b) {
  return _.join(["1"], "-");
}
add2();
$('body').css('background', 'red');
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
console.log('$', $)
console.log('window.$', window.$)
axios.get("/api/article/page/1").then(result => {
  console.log('axioe success: \n', result)
}).catch(error => {
  console.log('axios error:\n', error)
})