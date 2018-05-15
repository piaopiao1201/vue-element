<template>
  <div id="app">
    <transition name='fade' mode='out-in'>
    		<router-view></router-view>
    </transition>
    <!-- <img src="./assets/logo.png"> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
.fade-enter,.fade-leave-to
  opacity:0
.fade-enter-active,.fade-leave-active
  transition:opacity .2s ease

</style>
