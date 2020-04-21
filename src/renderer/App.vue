<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "cookobot-app",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    logout() {
      this.$store.dispatch("auth", false);
    }
  }
};
</script>

<style>
/* CSS */
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--lightbackground);
}

:root {
  --success: rgb(126, 179, 66);
  --danger: rgb(204, 80, 80);
  --darkbackground: #293948;
  --darker: #0D161D;
  --lightbackground: #eaebed;
  --disabled: rgba(149, 149, 149, 0.712);
  --primary: #579597;
  --robot1: #00b4be;
  --robot2: #ffaa67;
}
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}
</style>
