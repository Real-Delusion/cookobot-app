<template>
  <div class="card queue_list">
    <header class="card-header">
      <p class="card-header-title">Robot 98R2X3</p>
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
      <span>Please select the tables that the robot has to attend.</span>
    </div>
    <div class="card-content" v-else>
      <!-- Draggable list -->
      <SlickList lockAxis="y" v-model="tables">
        <SlickItem
          v-for="(table, index) in tables"
          :key="table"
          :index="index"
          class="card box_element_list"
        >
          <font-awesome-icon class="draggable_icon" icon="grip-vertical" />
          Table {{ table }}
          <div
            class="icon delete_icon"
            @touchstart="deleteTable(table)"
            @mousedown="deleteTable(table)"
          >
            <font-awesome-icon icon="times-circle" />
          </div>
        </SlickItem>
      </SlickList>
    </div>
    <footer class="card-footer footer is-fixed-bottom">
      <button
        class="button is-danger is-fullwidth is-flex-tablet-only cancel_button"
        type="button"
        v-on:click="deleteAllTables()"
        :disabled="tables.length==0"
      >Clear all</button>
      <button
        class="button is-success is-fullwidth is-flex-tablet-only accept_button"
        type="button"
        v-on:click="accept()"
        :disabled="tables.length==0"
      >Accept</button>
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
      tables: []
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
    accept: function() {
      //Insert action with ros sending the list: tables
    },
    deleteTable: function(table) {
      this.tables.splice(this.tables.indexOf(table), 1);
      bus.$emit("deleteTable", table);
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
  margin-top: 10px;
  padding-top: 1.5ch;
  padding-bottom: 1.5ch;
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
  font-size: 1em;
  color: gray;
  align-items: center;
}
.delete_icon:hover {
  color: rgb(204, 80, 80);
  transform: scale(1.05);
}
.card-header {
  height: 15%;
}
.card-content {
  height: 75%;
}
.card-footer {
  height: 10%;
  align-items: center;
}
.cancel_button {
  background-color: rgb(204, 80, 80);
}
.accept_button {
  background-color: rgb(126, 179, 66);
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
}
.settings_icon {
  font-size: 2rem;
}
.warning_icon {
  font-size: 6rem;
  padding: 4rem;
}
</style>
