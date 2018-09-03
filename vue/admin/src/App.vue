<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<script>
import './css/reset.css';
export default {
  name: 'App'
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
