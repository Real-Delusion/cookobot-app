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
  background-color: #eaebed;
}
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}
</style>
