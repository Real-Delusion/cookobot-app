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
        >
          <font-awesome-icon 
          :style="{'color':colorDraggableIcon}"
          class="draggable_icon" icon="grip-vertical" />
          <p v-if="table!=0">Table {{ table }}</p>
          <p v-else>Kitchen</p>
          <div
            class="icon delete_icon"
            :style="{ 'display': displayServing }"
            ref="deleteTableIcon"
            @touchstart="deleteTable(table)"
            @mousedown="deleteTable(table)"
          >
            <font-awesome-icon icon="times-circle"/>
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
          <font-awesome-icon icon="trash-alt" />
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
      colorDraggableIcon: ''
    };
  },

  created: async function() {
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
      // Changing style for the table that is serving
      let $refServing = this.$refs.table[this.indexTables].$el;
      $refServing.style.backgroundColor = "#ffff";
      $refServing.style.border = "solid";
      $refServing.style.borderColor = "var(--robot1)";
      //this.displayServing = "none";
      this.colorDraggableIcon= "white"

      this.$refs.deleteTableIcon[this.indexTables].style.display='none'

      this.serving = true;
      //this.backgroundColor = "var(--disabled)";
      //Insert action with ros sending the list: tables
      bus.$emit("sendTables", this.tables[this.indexTables]);
      bus.$on("sendRes", async res => {
        // Changing style for the table that is served
        let $refServed = this.$refs.table[this.indexTables].$el;
        $refServing.style.border = "solid";
        $refServing.style.borderColor = "var(--success)";
  
        this.served = true;
        this.displayServing=''

        if (this.indexTables < this.tables.length - 1) {
          this.indexTables++;
          this.accept();
        } else {
          console.log("END SERVING TABLES");
          this.deleteAllTables();
          this.serving = false;
        }
      });
    },
    deleteTable: function(table) {
      this.tables.splice(this.tables.indexOf(table), 1);
      bus.$emit("deleteTable", table);
    },
    cancelServing: function() {
      bus.$emit("sendTables", -1);
      this.serving = false;
      this.tables=[];
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
  -webkit-user-drag:none;
  user-select: none;
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
  height: 75%;
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
  height: 75%;
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
</style>
