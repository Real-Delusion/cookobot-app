<template>
  <div>
    <input v-model="checked" type="checkbox" id="navigation" />
    <transition name="fade">
      <label v-if="!checked" for="navigation">
        <span class="icon" style="padding-left: 1.3rem">
          <font-awesome-icon icon="chevron-right" />
        </span>
      </label>
      <label v-if="checked" for="navigation">
        <span class="icon" style="padding-left: 1.2rem">
          <font-awesome-icon icon="chevron-left" />
        </span>
      </label>
    </transition>
    <nav>
      <ul>
        <div id="logo">
          <img src="@/assets/logo-blanco.png" />
          <span style="font-size: 1rem">CONTROL PANEL</span>
        </div>
        <li class="user-info">
          <div>
            <span class="icon">
              <font-awesome-icon icon="user" />
            </span>
            {{this.$store.state.user_name}}
            <div class="user-type">
              <span v-if="this.$store.state.user_type>0 ">Admin</span>
            </div>
            <!--  <span v-else>User</span> -->
          </div>
        </li>
        <li>
          <router-link to="/dashboard" replace>
            <span class="icon">
              <font-awesome-icon icon="utensils" />
            </span>My Restaurant
          </router-link>
        </li>
        <li v-if="this.$store.state.user_type > 0">
          <router-link to="/users" replace>
            <span class="icon">
              <font-awesome-icon icon="users" />
            </span>Users
          </router-link>
        </li>
        <li v-on:click="logout()">
          <a href="#">
            <span class="icon">
              <font-awesome-icon icon="sign-out-alt" />
            </span>Logout
          </a>
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
      // Clear auth
      this.$store.dispatch("auth", false);
      this.$store.dispatch("name", "");
      this.$store.dispatch("type", 0);

      // Go to login
      this.$router.push("login");
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
  width: 25%;
  height: 100%;
  margin: 0 0 0 -25%;
  -moz-transition: all 200ms ease-in;
  -webkit-transition: all 200ms ease-in;
  -o-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
  z-index: 999;
  font-size: 2rem;
}
.icon {
  padding-right: 2rem;
  padding-left: 1rem;
}
nav ul {
  width: 100%;
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
li > * {
  color: #fff;
  font-size: 1em;
  text-decoration: none;
  display: block;
  padding: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
  border-bottom: 1px solid #333;
  align-items: center;
  display: flex;
}
nav a:hover {
  background: #4e5a66;
}
label {
  font-weight: 700;
  color: white;
  text-align: center;
  font-size: 1.7em;
  line-height: 1.1em;
  background-color: rgb(31, 40, 47);
  position: fixed;
  top: 80%;
  left: 0;
  width: 47px;
  height: 85px;
  cursor: pointer;
  border-radius: 0 3rem 3rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  left: 25%;
}
.user-info {
  color: var(--disabled);
  background-color: #0d161d;
  text-transform: uppercase;
}
.user-info svg {
  color: white;
}
.user-type {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  font-size: 1.2rem;
}
#logo {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  color: #ffffff;
  flex-direction: column;
  align-items: center;
}
#logo img {
  max-width: 70%;
}
.user-info div {
  display: flex;
}
.user-info div span {
  color: #4e5a66;
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
  border-left: 0.5rem solid white;
  border-top: 1px solid #6f838e;
  border-bottom: 1px solid #6f838e;
}
.lid {
  padding-left: 1.2rem;
}
</style>