<template>
  <div class="card queue_list">
    <header class="card-header">
      <div class="robot_info">
        <p class="card-header-title">Robot #123456</p>
        <p class="card-header-description description_robot">Kitchen</p>
      </div>
      <a href="#" class="card-header-icon" aria-label="Settings">
        <span class="icon">
          <font-awesome-icon icon="cog" class="settings_icon" />
        </span>
      </a>
    </header>
    <div class="card-content-message" v-if="tables.length==0">
      <div class="loading" v-show="goingKitchen">
        <progress class="progress is-small is-primary" max="100">15%</progress>
        <p>Returning to kitchen...</p>
      </div>
      <div v-show="!goingKitchen">
        <span class="icon warning_icon">
          <font-awesome-icon class icon="exclamation-circle" />
        </span>
        <span>Please select the tables that the robot has to attend</span>
      </div>
    </div>
    <div class="card-content" v-else>
      <!-- Draggable list -->
      <SlickList lockAxis="y" v-model="tables">
        <SlickItem
          v-for="(table, index) in tables"
          :key="table.id"
          :index="index"
          v-bind:class="[table.serving ? 'draw' : '', 'card box_element_list']"
          v-bind:style="{ 'backgroundColor': 'white' }"
          ref="table"
          :disabled="servingTables"
          v-bind:served="table.served"
        >
          <div
            class="icon draggable_icon"
            :style="[servingTables ? {'color': 'white'} : {'color': ''}]"
          >
            <font-awesome-icon icon="grip-vertical" />
          </div>
          <p v-if="table.id!=0">Table {{ table.id }}</p>
          <p v-else>Kitchen</p>
          <div
            class="icon delete_icon"
            v-show="!table.serving"
            @touchstart="deleteTable(table)"
            @mousedown="deleteTable(table)"
            :style="[table.served ? {'color': 'var(--success)'} : {'color': ''}]"
          >
            <font-awesome-icon v-bind:icon="table.served ? 'check-circle' : 'times-circle'" />
          </div>
        </SlickItem>
      </SlickList>
    </div>
    <footer class="card-footer footer is-fixed-bottom">
      <button
        class="button cancel_button is-danger is-fullwidth is-flex-tablet-only"
        type="button"
        v-on:click="deleteAllTables()"
        :disabled="tables.length==0"
        v-if="servingTables==false"
      >
        <span class="btn_icon">
          <font-awesome-icon icon="trash-alt" />
        </span>
        Clear all
      </button>
      <button
        class="button accept_button is-success is-fullwidth is-flex-tablet-only"
        type="button"
        v-on:click="accept()"
        :disabled="tables.length==0"
        v-if="servingTables==false"
      >
        <span class="btn_icon">
          <font-awesome-icon icon="check-circle" />
        </span>
        Accept
      </button>
      <button
        class="button cancel_button is-danger is-fullwidth is-flex-tablet-only"
        type="button"
        v-on:click="cancelServing()"
        :disabled="tables.length==0"
        v-else
      >
        <span class="btn_icon">
          <font-awesome-icon icon="times-circle" />
        </span>
        Cancel
      </button>
    </footer>
  </div>
</template>


<script>
// import bus for events
import { bus } from "../../main";
import Ros from "@/mixins/ros.js";

// import slicksort for draggable list elements
import { SlickList, SlickItem } from "vue-slicksort";

export default {
  mixins: [Ros],
  components: {
    SlickItem,
    SlickList
  },
  data() {
    return {
      tables: [],
      servingTables: false,
      goingKitchen: false,
      serviceCancelled: false
    };
  },
  created: async function() {
    await this.connectRos();

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
    deleteAllTables: function() {
      this.tables = [];
      bus.$emit("deleteTables", this.tables);
    },
    accept: async function() {
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
    deleteTable: function(table) {
      this.tables.splice(this.tables.indexOf(table), 1);
      bus.$emit("deleteTable", table.id);
    },
    cancelServing: function() {
      this.resetAllTables();
      this.deleteAllTables();
      this.serviceCancelled = true;
      this.goingKitchen = true;
    },
    resetAllTables: function() {
      for (var i = 0; i < this.tables.length; i++) {
        let table = this.tables[i];
        table.served = false;
      }
    },
    goToTable: function(table) {
      return new Promise((resolve, reject) => {
        //console.log("ESTOY DENTRO DE GO TO TABLE");

        // define the request
        let request = new ROSLIB.ServiceRequest({
          numeroMesa: table
        });

        this.navService.callService(
          request,
          result => {
            console.log("This is the response of the service ");
            resolve(result);
          },
          error => {
            console.log("This is the error response of the service ");
            reject(error);
          }
        );
      });
    }
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
  border-left-color: var(--robot1);
  border-left-style: solid;
  border-left-width: 1rem;
  display: flex;
  flex-direction: column;
}

.description_robot {
  margin-left: 1rem;
  font-size: 1.5rem;
}
.loading {
  text-align: center;
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
