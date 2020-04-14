<template>
  <div id="login">
    <h1>Login</h1>
    <input type="text" name="userid" v-model="input.userid" placeholder="User id" />
    <button class="button is-success" type="button" v-on:click="login()">Login</button>
    <p class="message">{{message}}</p>
  </div>
</template>

<script>
import { getUserById } from "@/utils/db";

export default {
  name: "login",
  components: {},
  data() {
    return {
      input: {
        userid: ""
      },
      message: ""
    };
  },
  methods: {
    async login() {
      // Get input id
      let userId = this.input.userid;

      if (userId != "") {
        // Get user data from db
        let getUser;
        await getUserById(userId).then(data => {
          getUser = data;
        });

        // Check if input id equals user id
        if (userId == getUser.user_id) {
          // Authorized
          this.$store.dispatch("auth", true); // Set Auth Vuex state to true

          // Set Vuex user data
          this.$store.dispatch("name", getUser.name);
          this.$store.dispatch("type", getUser.user_type);

          // Go to dashboard
          this.$router.push("dashboard");
        } else {
          this.message = "The user id is incorrect";
        }
      } else {
        this.message = "Please, fill the user id";
      }
    }
  }
};
</script>

<style>
</style>
