<template>
  <div id="login" class="container-fluid">
    <div class="columns is-marginless">
      <div class="column is-full" style="height: 25vh">
        <label class="title is-1" id="inputLogIn">{{userid}}</label>
        <div v-if="errorMessage == true" class="column is-full">
          <p class="message">{{message}}</p>
        </div>
      </div>
    </div>
    <div class="columns is-marginless is-centered">
      <div class="column is-one-third" style="height: 75vh">
        <NumericKeyboard @pressed="userid = $event" :selfValue="userid"></NumericKeyboard>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserById } from "@/utils/db";
import NumericKeyboard from "@/components/UI/NumericKeyboard/NumericKeyboard";

export default {
  name: "login",
  components: {
    NumericKeyboard
  },
  data() {
    return {
      // input: {
      //   userid: ""
      // },
      errorMessage: false,
      message: "",
      userid: ""
    };
  },
  methods: {
    async login() {
      // Get input id
      // let userId = this.input.userid;
      let userId = this.userid;

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
          this.errorMessage = true;
          this.message = "The user id is incorrect";
        }
      } else {
        this.errorMessage = true;
        this.message = "Please, fill the user id";
      }
    }
  }
};
</script>

<style scoped>
#login {
  background: #293948;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

#inputLogIn {
  /* -webkit-text-security: circle; */
  color: white;
}

#loginContainer {
  display: flex;
  align-content: center;
  align-items: center;
  height: 100vh;
}

#keyboard {
  margin: 2em;
  width: 40%;
  justify-content: center;
}
</style>