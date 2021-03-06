<template>
  <div class="card queue_list">
    <header class="card-header">
      <div class="robot_info" v-for="robot in robots" v-bind:key="robot.id" v-show="robot.selected"
        v-bind:style="{'border-left-color': robot.color}">
        <p class="card-header-title">Robot #{{robot.id}}</p>
        <p class="card-header-description description_robot">{{robot.description}}</p>
      </div>
      <a class="card-header-icon" aria-label="Settings" @click="openConfigModal()">
        <span class="icon">
          <font-awesome-icon icon="cog" class="settings_icon" />
        </span>
      </a>
    </header>
    <!-- Empty Draggable list -->
    <div class="card-content-message" v-if="tables.length==0">
      <div class="loading" v-show="goingKitchen && connected">
        <progress class="progress is-small is-primary" max="100">15%</progress>
        <p>Returning to kitchen...</p>
      </div>
      <div v-show="!goingKitchen && connected">
        <span class="icon warning_icon">
          <font-awesome-icon class icon="exclamation-circle" />
        </span>
        <span>Please select the tables that the robot has to attend</span>
      </div>
      <div v-show="!connected">
        <span class="icon warning_icon">
          <font-awesome-icon class icon="exclamation-triangle" />
        </span>
        <span>Not connected to the server</span>
      </div>
    </div>
    <div class="card-content" v-else v-bind:class="[!connected ? 'card-content-message' : '' , '']">
      <div v-show="!connected">
        <span class="icon warning_icon">
          <font-awesome-icon class icon="exclamation-triangle" />
        </span>
        <span>Not connected to the server</span>
      </div>
      <!-- Draggable list -->
      <SlickList lockAxis="y" v-model="tables" v-show="connected">
        <SlickItem v-for="(table, index) in tables" :key="table.id" :index="index"
          v-bind:class="[table.serving ? 'draw' : '', 'card box_element_list']"
          v-bind:style="{ 'backgroundColor': 'white' }" ref="table" :disabled="servingTables"
          v-bind:served="table.served">
          <div class="icon draggable_icon" :style="[servingTables ? {'color': 'white'} : {'color': ''}]">
            <font-awesome-icon icon="grip-vertical" />
          </div>
          <p v-if="table.id!=0">Table {{ table.id }}</p>
          <p v-else>Kitchen</p>
          <div class="icon delete_icon" v-show="!table.serving" @touchstart="deleteTable(table)"
            @mousedown="deleteTable(table)" :style="[table.served ? {'color': 'var(--success)'} : {'color': ''}]">
            <font-awesome-icon v-bind:icon="table.served ? 'check-circle' : 'times-circle'" />
          </div>
        </SlickItem>
      </SlickList>
    </div>
    <footer class="card-footer footer is-fixed-bottom">
      <!-- Cancel button -->
      <button class="button cancel_button is-danger is-fullwidth is-flex-tablet-only" type="button"
        v-on:click="deleteAllTables()" :disabled="tables.length==0" v-if="servingTables==false">
        <span class="btn_icon">
          <font-awesome-icon icon="trash-alt" />
        </span>
        Clear all
      </button>
      <!-- Accept button -->
      <button class="button accept_button is-success is-fullwidth is-flex-tablet-only" type="button"
        v-on:click="accept()" :disabled="tables.length==0" v-if="servingTables==false">
        <span class="btn_icon">
          <font-awesome-icon icon="check-circle" />
        </span>
        Accept
      </button>
      <!-- Cancel serving button -->
      <button class="button cancel_button is-danger is-fullwidth is-flex-tablet-only" type="button"
        v-on:click="confirmationModal=true" :disabled="tables.length==0" v-else>
        <span class="btn_icon">
          <font-awesome-icon icon="times-circle" />
        </span>
        Cancel
      </button>
    </footer>
    <!-- Confirmation modal -->
    <div class="modal" v-bind:class="{ 'is-active': confirmationModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="confirmation_message">
            Are you sure you want to cancel the serving?
          </div>
          <div class="confirmation_buttons">
            <button class="button accept_button is-success" v-on:click="acceptModal()">Confirm</button>
            <button class="button cancel_button is-danger" v-on:click="cancelModal()">Cancel</button>
          </div>
        </section>
      </div>
    </div>

    <!-- Configuration  modal -->
    <!-- <ConfigureModal :isActive=configureModal></ConfigureModal> -->
    <div class="modal" v-bind:class="{ 'is-active': configureModal }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <article class="message is-dark">
          <div class="message-header" v-for="robot in robots" v-bind:key="robot.id" v-show="robot.selected"
        v-bind:style="{'background-color': robot.color}" >
            Configure Text to Speech
            <button class="delete" aria-label="close" type="button" v-on:click="closeConfigModal()"></button>
          </div>
          <div class="message-body">
            <div class="content columns">
              <div class="column">
                <div class="columns">
                  <div class="column is-full">
                    <label>Text to speech:</label>
                    <input class="input" type="text" placeholder="Text to speech" v-model="textToSpeech">                    
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-4 is-offset-8">
                    <button v-on:click="updateServeAudio()" class="button is-success" :disabled="disabledActionButtons">Save & Update</button>
                  </div> 
                </div>
              </div>
              
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>

</template>


<script>
  // import bus for events
  import {
    bus
  } from "../../main";
  import Ros from "@/mixins/ros.js";
  import Arm from "@/mixins/arm.js";


  // import slicksort for draggable list elements
  import {
    SlickList,
    SlickItem
  } from "vue-slicksort";

  export default {
    mixins: [Ros, Arm],
    components: {
      SlickItem,
      SlickList,
    },
    props: ["robots"],
    data() {
      return {
        tables: [],
        servingTables: false,
        goingKitchen: false,
        serviceCancelled: false,
        confirmationModal: false,
        configureModal: false,
        textToSpeech: '',
        disabledActionButtons: false,
        activeModal: false,
        nombreArchivo: "",
      };
    },
    watch: {
      connected: function () {
        if (!this.connected) {
          this.serviceDisconnected();
        }
      },
      goingKitchen: function () {
        //console.log(this.goingKitchen);
      }
    },
    created: async function () {
      await this.connectRos();
      await this.foldArm();

      bus.$on("tableAdded", table => {
        //Adding data to the list
        //console.log(this.tables)
        if (this.tables.includes(table)) {
          this.tables.splice(this.tables.indexOf(table), 1);
        } else {
          this.tables.push(table);
        }
      });
    },
    methods: {
      deleteAllTables: function () {
        this.tables = [];
        bus.$emit("deleteTables", this.tables);
      },
      accept: async function () {
        this.servingTables = true;
        // Send robot to serve the tables from the list
        for (var i = 0; i < this.tables.length; i++) {
          if (this.serviceCancelled) {
            break;
          } else {
            let table = this.tables[i];
            console.log("Await table ", table.id);
            table.serving = true;
            let res = await this.goToTable(table.id);
            console.log(res);
            if (!res["success"]) {
              console.log("Something went wrong...");
              break;
            }

            if (table.id != 0) {
              // The robot is at a table. Now we check it's at the correct table
              let atCorrectTable = await this.recognizeTableNumber(table.id);

              // If it's not, we send it to kitchen
              if (!atCorrectTable) {
                console.log("This is not the correct table");
                table.serving = false;
                break;
              }
              // Serve food
              await this.serveArm();

              // Play serve audio
              this.playWhenServe('serveText')
              
              // Wait 5s
              await new Promise(r => setTimeout(r, 5000));

              // Fold arm
              await this.foldArm();
            }

            table.served = true;
            table.serving = false;
          }
        }
        console.log("END SERVING TABLES, sending to kitchen");

        this.resetAllTables();

        // Send to kitchen when finished
        this.serviceCancelled = false;
        this.goingKitchen = true;
        this.deleteAllTables();
        let res = await this.goToTable(0);
        console.log(res);
        if (!res["success"]) {
          console.log("Something went wrong...");
        }
        this.goingKitchen = false;
        this.servingTables = false;
      },
      deleteTable: function (table) {
        this.tables.splice(this.tables.indexOf(table), 1);
        bus.$emit("deleteTable", table.id);
      },
      acceptModal: function () {
        this.confirmationModal = false
        this.cancelServing()
      },
      cancelModal: function () {
        this.confirmationModal = false
      },
      openConfigModal: function () {
        this.configureModal = true
      },
      closeConfigModal: function () {
        this.configureModal = false
      },
      cancelServing: function () {
        this.resetAllTables();
        this.deleteAllTables();
        this.serviceCancelled = true;
        this.goingKitchen = true;
      },
      serviceDisconnected: function () {
        this.resetAllTables();
        this.deleteAllTables();
        this.goingKitchen = false;
        this.serviceCancelled = false;
        this.servingTables = false;
      },
      resetAllTables: function () {
        for (var i = 0; i < this.tables.length; i++) {
          let table = this.tables[i];
          table.served = false;
        }
      },
      goToTable: function (table) {
        return new Promise((resolve, reject) => {
          //console.log("ESTOY DENTRO DE GO TO TABLE");

          // define the request
          let request = new ROSLIB.ServiceRequest({
            numeroMesa: table
          });

          this.navService.callService(
            request,
            result => {
              //console.log("This is the response of the service ");
              resolve(result);
            },
            error => {
              //console.log("This is the error response of the service ");
              reject(error);
            }
          );
        });
      },
      recognizeTableNumber: function (table) {
        return new Promise(async (resolve, reject) => {
          console.log("recognizeTableNumber");

          // send goal to take photo
          this.rekognitionGoal.send();

          console.log("rekognition goal sent");
          let taken = null;
          let predicted = null;
          try {
            taken = await this.awaitPhoto();
          } catch (error) {
            console.log(error);
          }

          if (taken) {
            console.log("Photo is taken");

            // Now we predict the number in the photo
            this.predictionGoal.send();

            console.log("prediction goal sent");
            predicted = null;
            try {
              predicted = await this.awaitPrediction();
            } catch (error) {
              console.log(error);
            }
            console.log("el predicted: ");
            console.log(predicted);
          }

          // check if the table number recognized is correct
          if (true) {
            resolve(true);
          } else resolve(false);
        });
      },
      updateServeAudio: async function () {
        try{
          console.log(this.generated)
          this.runPollyAction('serveText.ogg', this.textToSpeech, 1);
          let generated = await this.awaitPolly();
          if(generated == true){ this.disabledActionButtons = false}
          else { this.disabledActionButtons = true}
        } catch (error) {
          console.error(error);
        }
      },
      playAudio: async function () {
        try{
          this.runPollyAction(this.nombreArchivo+'.ogg', '', 2);
          let played = await this.awaitPolly();
          if(played == true){ this.disabledActionButtons = false}
          else { this.disabledActionButtons = true}
        }
        catch (error) {
          console.error(error);
        }
      },
      deleteAudio: async function () {
        try{
          this.runPollyAction(this.nombreArchivo+'.ogg', '', 3);
          let deleted = await this.awaitPolly();
          if(deleted == true){ this.disabledActionButtons = false}
          else { this.disabledActionButtons = true}
        }
        catch (error) {
          console.error(error);
        }
      },
      playWhenServe: async function (nombreArchivo) {
        try{
          this.runPollyAction(nombreArchivo+'.ogg', '', 2);
          let playedServe = await this.awaitPolly();
          if(playedServe == true){ this.disabledActionButtons = false}
          else { this.disabledActionButtons = true}
        }
        catch (error) {
          console.error(error);
        }
      },
    }
  };
</script>


<style scoped>
  .queue_list {
    width: 100%;
    height: 100%;
    min-height: 100px;
    font-size: 1.8rem;
  }

  .footer {
    padding: 20px;
  }

  .box_element_list {
    border-radius: 0.5ch;
    margin-top: 1rem;
    padding-top: 1.5ch;
    padding-bottom: 1.5ch;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
  }

  .draggable_icon {
    margin-right: 1ch;
    margin-left: 1ch;
  }

  .settings_icon {
    color: gray;
    font-size: 20px;
    margin-right: 3rem;
  }

  .button {
    margin-right: 10px;
    margin-left: 10px;
  }

  .delete_icon {
    justify-content: center;
    align-items: center;
    float: right;
    margin-right: 10px;
    font-size: 1.2em;
    color: gray;
    margin-right: 1.5rem;
    margin-left: auto;
  }

  /*.delete_icon:hover {
  color: rgb(204, 80, 80);
  transform: scale(1.05);
}*/
  .card-header {
    height: 15%;
    justify-content: space-between;
  }

  .card-header-title {
    padding-top: 0rem;
    padding-bottom: 0rem;
  }

  .card-content {
    height: 74%;
  }

  .card-footer {
    align-items: center;
  }

  .cancel_button {
    background-color: var(--danger) !important;
    height: 40%;
    font-size: 1.5rem;
  }

  .accept_button {
    background-color: var(--success) !important;
    height: 40%;
    font-size: 1.5rem;
  }

  .card-content-message {
    height: 74%;
    align-items: center;
    font-size: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    color: var(--disabled);
  }

  .settings_icon {
    font-size: 2rem;
  }

  .warning_icon {
    font-size: 6rem;
    padding: 4rem;
    color: var(--disabled);
    display: flex;
    margin-left: auto;
    margin-right: auto;
  }

  .btn_icon {
    margin-right: inherit;
  }

  .robot_info {
    margin: 1.8rem;
    border-left-style: solid;
    border-left-width: 1rem;
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
  }

  .description_robot {
    margin-left: 1rem;
    font-size: 1.5rem;
  }

  .loading {
    text-align: center;
  }

  .modal {
    z-index: 95;
  }


  .modal-card-body {
    border-radius: 0.3rem;
    margin-left: auto;
    margin-right: auto;
    font-size: 1.8rem;
  }

  .confirmation_buttons {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* ANIMATED BORDER */
  .draw {
    overflow: hidden;
    position: relative;
  }

  .draw::before,
  .draw::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: 3px solid transparent;
    border-radius: 0.5ch;
    width: 0;
    height: 0;
  }

  .draw::before {
    top: 0;
    left: 0;
    border-top-color: var(--robot1);
    border-right-color: var(--robot1);
    animation: border 2s infinite;
  }

  .draw::after {
    bottom: 0;
    right: 0;
    animation: border 2s 1s infinite, borderColor 2s 1s infinite;
  }

  .headerModal {

  }


  @keyframes border {
    0% {
      width: 0;
      height: 0;
    }

    25% {
      width: 100%;
      height: 0;
    }

    50% {
      width: 100%;
      height: 100%;
    }

    100% {
      width: 100%;
      height: 100%;
    }
  }

  @keyframes borderColor {
    0% {
      border-bottom-color: var(--robot1);
      border-left-color: var(--robot1);
    }

    50% {
      border-bottom-color: var(--robot1);
      border-left-color: var(--robot1);
    }

    51% {
      border-bottom-color: transparent;
      border-left-color: transparent;
    }

    100% {
      border-bottom-color: transparent;
      border-left-color: transparent;
    }
  }
</style>