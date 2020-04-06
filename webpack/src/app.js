import _ from 'lodash'
export function add (a, b) {
  return _.join(['1'], '-')
}
add();
export function minus (a, b) {
  return a - b 
}
function getComponent() {
  return import("jquery").then(({default: jq}) => {
    return jq("<div></div>").html("动态导入库");
  })
}

getComponent().then(item => {
  item.appendTo("body").css('background',"red")
})