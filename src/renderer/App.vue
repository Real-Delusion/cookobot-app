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
</style>
