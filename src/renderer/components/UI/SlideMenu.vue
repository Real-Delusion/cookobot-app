<template>
  <div>
    <input v-model="checked" type="checkbox" id="navigation" />
    <transition name="fade">
      <label v-if="!checked" for="navigation">&#9776;</label>
      <label v-if="checked" for="navigation">x</label>
    </transition>
    <nav>
      <ul>
        <li class="user-info">
          {{this.$store.state.user_name}}
          <span v-if="this.$store.state.user_type >0 ">(Admin)</span>
          <span v-else>(User)</span>
        </li>
        <li>
          <router-link to="/dashboard" replace>Home</router-link>
        </li>
        <li v-if="this.$store.state.user_type > 0">
          <router-link to="/users" replace>Users</router-link>
        </li>
        <li>
          <router-link to="/login" v-on:click="logout()" replace>Logout</router-link>
        </li>
      </ul>
    </nav>
    <transition name="fade">
      <div v-if="checked" v-on:click="closeMenu()" class="overlay"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    };
  },
  methods: {
    logout: function() {
      this.$emit("authenticated");
    },
    closeMenu: function() {
      this.checked = false;
    },
    openMenu: function() {
      this.checked = true;
    }
  }
};
</script>

<style scoped>
.overlay {
  position: absolute;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 95;
}
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  margin: 0 0 0 -250px;
  -moz-transition: all 200ms ease-in;
  -webkit-transition: all 200ms ease-in;
  -o-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  z-index: 999;
}
nav ul {
  width: 250px;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  background: #293948;
  overflow: hidden;
}
nav li {
  margin: 0;
}
nav a {
  color: #fff;
  font-size: 1em;
  text-decoration: none;
  display: block;
  padding: 12px 15px;
  font-weight: 300;
  letter-spacing: 2px;
  border-bottom: 1px solid #333;
}
nav a:hover {
  background: #4e5a66;
}
label {
  display: block;
  font-weight: 700;
  width: 42px;
  height: 42px;
  line-height: 42px;
  color: #b4b4b4;
  text-align: center;
  font-size: 2em;
  line-height: 1.1em;
  position: fixed;
  top: 10px;
  left: 10px;
  -moz-transition: all 200ms ease-in;
  -webkit-transition: all 200ms ease-in;
  -o-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  z-index: 500;
}
input[type="checkbox"] {
  display: none;
}
input[type="checkbox"]:checked ~ nav {
  margin: 0;
}
input[type="checkbox"]:checked ~ label {
  left: 260px;
}
.user-info {
  color: #e1e2e5;
  text-align: center;
  background-color: #0d161d;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.router-link-active {
  background-color: #4e5a66;
}
</style>