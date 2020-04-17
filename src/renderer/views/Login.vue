<template>
  <div id="login" class="container is-fluid" style="background:#293948">
    <div class="column">
      <input 
        id="inputLogIn"
        class="input is-large is.primary"
        type="password" 
        name="userid" 
        v-model="input.userid" 
        placeholder="User id" 
        maxlength="4"
        color="input-disabled-background-color"
      />
      <!-- <button class="button is-success" type="button" v-on:click="login()">Login</button> -->
      <p class="message">{{message}}</p>

      <NumericKeyboard 
        @pressed="input.userid = $event"
        :selfValue="input.userid">
      </NumericKeyboard>
    </div>
  </div>
</template>

<script>
import { getUserById } from "@/utils/db";
import NumericKeyboard from "@/components/UI/NumericKeyboard/NumericKeyboard";

export default {
  name: "login",
  components: {NumericKeyboard},
  data() {
    return {
      input: {
        userid: ""
      },
      message: "",
      value: '',
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

<style scoped>

</style>
