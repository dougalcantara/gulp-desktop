<template>
  <main>
    <div class="heading-container">
      <div class="inner">
        <h2 class="headline">Gulp Desktop</h2>
        <h2 class="subheadline">v0.1.0</h2>
      </div>
    </div>
    <div class="content-container">
      <div class="inner">
        <span>todos:</span>
        <ul>
          <li>Projects view</li>
          <li>Configs view</li>
          <li>Marketplace view</li>
          <li>Settings view</li>
          <li>Help view</li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>

  export default {
    name: 'home',
    methods: {
    },
  };
</script>

<style lang="scss" scoped>
main {
  height: 100vh;
}
.content-container {
  padding-top: 2em;
  ul {
    padding-left: 1em;
  }
}
</style>
