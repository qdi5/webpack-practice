<template>
  <div class="diy-vue-cli ">
    <h2 class="haha">我的diy app.vue {{ haha }}</h2>
    <hello-world></hello-world>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
export default {
  data () {
    return {
      haha: '哈哈'
    }
  },
  methods: {
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
.diy-vue-cli {
  background: red;
  color: #fff;
}
</style>
