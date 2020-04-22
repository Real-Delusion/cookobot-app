<template>
  <div class="card queue_list">
    <header class="card-header">
      <div class="robot_info">
        <p class="card-header-title">Robot 98R2X3</p>
        <p class="card-header-description description_robot">Description</p>
      </div>
      <a href="#" class="card-header-icon" aria-label="Settings">
        <span class="icon">
          <font-awesome-icon icon="cog" class="settings_icon" />
        </span>
      </a>
    </header>
    <div class="card-content-message" v-if="tables.length==0">
      <span class="icon warning_icon">
        <font-awesome-icon class icon="exclamation-circle" />
      </span>
      <span>Please select the tables that the robot has to attend</span>
    </div>
    <div class="card-content" v-else>
      <!-- Draggable list -->
      <SlickList lockAxis="y" v-model="tables">
        <SlickItem
          v-for="(table, index) in tables"
          :key="table"
          :index="index"
          class="card box_element_list"
          v-bind:style="{ 'backgroundColor': 'white' }"
          ref="table"
          :disabled="serving"
          v-bind:served="table.served"
        >
          <font-awesome-icon
            :style="{'color':colorDraggableIcon}"
            class="draggable_icon"
            icon="grip-vertical"
          />
          <p v-if="table.id!=0">Table {{ table.id }}</p>
          <p v-else>Kitchen</p>
          <div
            class="icon delete_icon"
            :v-show="!serving"
            ref="deleteTableIcon"
            @touchstart="deleteTable(table)"
            @mousedown="deleteTable(table)"
          >
            <font-awesome-icon v-bind:icon="served ? 'check-circle' : 'times-circle'" />
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
        v-if="serving==false"
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
        v-if="serving==false"
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
// import slicksort for draggable list elements
import { SlickList, SlickItem } from "vue-slicksort";

export default {
  mixins: [],
  components: {
    SlickItem,
    SlickList
  },
  data() {
    return {
      tables: [],
      indexTables: 0,
      serving: false,
      displayServing: "",
      served: false,
      colorDraggableIcon: ""
    };
  },

  created: async function() {
    this.indexTables = 0;
    bus.$on("tableAdded", table => {
      //Adding data to the list
      //console.log(this.tables)
      if (this.tables.includes(table.id)) {
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
      // Send robot to serve the tables from the list
      bus.$emit("sendTables", this.tables[this.indexTables].id);
      this.changeServingTableStyle();
      this.serving = true;
      this.waitResponse();
    },
    deleteTable: function(table) {
      this.tables.splice(this.tables.indexOf(table), 1);
      bus.$emit("deleteTable", table.id);
    },
    cancelServing: function() {
      bus.$emit("sendTables", -1);
      this.deleteAllTables();
      this.serving = false;
    },
    waitResponse: function() {
      // Waiting for the robot response
      bus.$on("sendRes", async res => {
        console.log("----- TABLE SERVED ----");
        if (this.indexTables < this.tables.length - 1) {
          this.changeServedTableStyle();
          this.indexTables++;
          this.served = true;
          this.accept();
        } else {
          //When the robot finishes it's sent to the kitchen
          //bus.$emit("sendTables", 0);
          console.log("END SERVING TABLES");
          this.deleteAllTables();
          this.indexTables = 0;
          this.serving = false;
        }
      });
    },
    changeServedTableStyle: function() {
      // Changing style for the table that is served
      let $refServed = this.$refs.table[this.indexTables].$el;
      $refServed.style.border = "solid";
      $refServed.style.borderColor = "var(--success)";
      $refServed.className = "card box_element_list";
      this.$refs.deleteTableIcon[this.indexTables].style.display = "";
      console.log(this.$refs.iconElement);
    },
    changeServingTableStyle: function() {
      // Changing style for the table that is serving
      let $refServing = this.$refs.table[this.indexTables].$el;
      //$refServing.style.border = "solid";
      //$refServing.style.borderColor = "var(--robot1)";

      this.colorDraggableIcon = "white"; //Change for a tick icon
      this.$refs.deleteTableIcon[this.indexTables].style.display = "none";

      $refServing.className = "card box_element_list draw";
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
.delete_icon:hover {
  color: rgb(204, 80, 80);
  transform: scale(1.05);
}
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
