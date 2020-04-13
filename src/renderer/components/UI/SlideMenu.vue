<template>
  <div>
    <input type="checkbox" id="navigation" />
    <label for="navigation">&#9776;</label>
    <nav>
      <ul>
        <li>
          <a href>Home</a>
        </li>
        <li>
          <router-link to="/login" v-on:click.native="logout()" replace>Logout</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
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
  font-family: "helvetica neue", helvetica, arial, sans-serif;
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
  font-family: "helvetica neue", helvetica, arial, sans-serif;
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
</style>