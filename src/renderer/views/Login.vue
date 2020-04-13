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
      let userId = this.input.userid;

      if (userId != "") {
        // Get user from db
        let getUser;
        await getUserById(userId).then(data => {
          getUser = data;
        });

        if (userId == getUser.user_id) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "dashboard" });
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
