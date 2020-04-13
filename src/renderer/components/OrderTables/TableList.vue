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
    <div class="card-content">
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
          <button class="icon delete_icon" @click="deleteTable(table)">
            <font-awesome-icon icon="times-circle" />
          </button>
        </SlickItem>
      </SlickList>
    </div>
    <footer class="card-footer footer">
      <button
        class="button is-danger is-fullwidth is-flex-tablet-only"
        type="button"
        v-on:click="deleteAllTables()"
      >Cancel</button>
      <button
        class="button is-success is-fullwidth is-flex-tablet-only"
        type="button"
        v-on:click="accept()"
      >Accept</button>
    </footer>
  </div>
</template>


<script>
// import bus for events
import { bus } from "../../main";
// import slicsor for draggable list elements
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
    },
    accept: function() {
      //Insert action with ros sending the list: tables
    },
    deleteTable: function(table) {
      // It doesn't work well because of the draggable list 
      console.log('before' + this.tables)
      this.tables.splice(this.tables.indexOf(table), 1);
      console.log('after' + this.tables)
    }
  }
};
</script>


<style scoped>
.queue_list {
  float: left;
  left: 50px;
  top: 20px;
  position: absolute;
  width: 500px;
  height: auto;
  min-height: 100px;
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
.box_element_list:hover {
  /*transform: scale(1.05);*/
}
.settings_icon {
  color: gray;
  font-size: 20px;
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
  font-size: 20px;
  color: gray;
}
.delete_icon:hover{
  color: red;
  transform: scale(1.05);
}
</style>
