import * as _ from 'lodash'
const NUM = 5
interface People {
  name: String,
  sex: String,
  age: Number
}

function onePeople(peo: People) {
  console.log(`name: ${peo.name}`)
}

onePeople({name: "刘德华", sex: '男', age: 50})