<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue';

  export default {
    name: 'gulp-desktop',
    components: { Navbar },
  };
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

// body {
//   font-family: 'Source Sans Pro', sans-serif;
// }

#app {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

router-view {
  align-self: stretch;
}
</style>
