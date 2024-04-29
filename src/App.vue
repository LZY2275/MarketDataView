<template>
  <div id="app">
    <!-- 标题 -->
    <div>
      <div class="title">
        实时行情显示页
      </div>
    </div>
    <HangqingView style="width: 100%;"></HangqingView>
  </div>
</template>

<script>
// import HuatuView from './components/HuatuView.vue'
import HangqingView from './components/HangqingView.vue'

export default {
  name: 'App',
  components: {
    HangqingView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  padding: 0;
  margin: 0;
}
.title{
    display: flex;
    font-size: 30px;
    font-weight: bold;
    /*color: rgba(50, 132, 110, 1);*/
    color: var(--td-brand-color-6);
    text-align: left;
    vertical-align: top;
    padding: 48px 36px;
}
</style>
