<template>
  <div id="app">
    <router-view @authenticated="setAuthenticated"></router-view>
  </div>
</template>

<script>
export default {
  name: "cookobot-app",
  data() {
    return {
      authenticated: true
    };
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      this.authenticated = false;
    }
  }
};
</script>

<style>
/* CSS */
body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-color: #eaebed;
}
</style>
