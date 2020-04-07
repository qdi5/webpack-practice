import _ from 'lodash'
export function add (a, b) {
  return _.join(['1'], '-')
}
add();
export function minus (a, b) {
  return a - b 
}
async function getComponent () {
  const { default: $ } = await import(/*webpackChunkName:"jquery"*/ "jquery");
  $("<div></div>").html("动态导入库").appendTo('body');
}
getComponent()

document.addEventListener("click", () => {
  import(/*webpackPrefetch: true*/ "./prefetch.js").then(({default: func}) => {
    func()
  })
})