<template>
  <div id="login" class="container-fluid">
    <div class="tile is-ancestor is-vertical" id="loginContainer">
      <div class="tile is-parent is-vertical">
        <div class="tile is-child">
          <div class="tile ">
            <label class="title is-1 is-centered" id="inputLogIn">
              {{userid}}
            </label>
          </div>
          <div v-if="errorMessage == true" class="column  is-full ">
            <p class="message">{{message}}</p>
          </div>
        </div>
      </div>

      <div class="tile is-parent" id="keyboard">
        <NumericKeyboard @pressed="userid = $event" :selfValue="userid"></NumericKeyboard>
      </div>

    </div>
  </div>
</template>

<script>
  import {
    getUserById
  } from "@/utils/db";
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
        userid: '',
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
            this.errorMessage = true
            this.message = "The user id is incorrect";
          }
        } else {
          this.errorMessage = true
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
    /* box-sizing: border-box; */
  }

  #inputLogIn {
    /* -webkit-text-security: circle; */
    color: white;
    background-color: #293948;
  }

  #loginContainer {
    display: flex;
    align-content: center;
    align-items: center;
    height: 100%;
  }

  #keyboard{
    margin: 2em;
  }


</style>