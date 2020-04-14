<template>
  <div>
    <input v-model="checked" type="checkbox" id="navigation" />
    <label for="navigation">&#9776;</label>
    <nav>
      <ul>
        <li class="user-info">{{this.$userData.user_name}}</li>
        <li>
          <router-link to="/dashboard" replace>Home</router-link>
        </li>
        <li v-if="this.$userData.user_type > 0">
          <router-link to="/users" replace>Users</router-link>
        </li>
        <li>
          <router-link to="/login" v-on:click="logout()" replace>Logout</router-link>
        </li>
      </ul>
    </nav>
    <div v-on:click="closeMenu()" class="overlay"></div>
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
    }
  }
};
</script>

<style scoped>
.overlay {
  display: none;
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
input[type="checkbox"]:checked ~ .overlay {
  display: inline;
}
.user-info {
  color: #e1e2e5;
  text-align: center;
  background-color: #0d161d;
}
</style>