<template>
  <div class="card queue_list">
    <header class="card-header">
      <p class="card-header-title">Robot 98R2X3</p>
      <a href="#" class="card-header-icon" aria-label="Settings">
        <span class="icon">
          <font-awesome-icon icon="cog" />
        </span>
      </a>
    </header>
    <div class="card-content">
      <draggable class="w-full max-w-md" ghost-class="moving-card" :list="tables" :animation="200">
        <div v-for="table in tables" :key="table" class="card box_element_list">
          <font-awesome-icon class="draggable_icon" icon="grip-vertical" />
          {{table}}
        </div>
      </draggable>
    </div>
    <footer class="card-footer footer">
      <button class="button is-danger" type="button">Cancel</button>
      <button class="button is-success" type="button">Accept</button>
    </footer>
  </div>
</template>

<script>
// import bus for events
import { bus } from "../../main";
import draggable from "vuedraggable";

export default {
  mixins: [],
  components: {
    draggable
  },
  data() {
    return {
      tables: []
    };
  },

  created: async function() {
    bus.$on("tableAdded", table => {
      //Adding data to the list
      //console.log("Table: " + this.details.includes("Table " + table))
      if (this.tables.includes("Table " + table)) {
        this.tables.splice(this.tables.indexOf("Table " + table), 1);
      } else {
        this.tables.push("Table " + table);
      }
    });
  },

  methods: {
    addTable: function() {
      details.push(table);
      //console.log(tables);
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
  font-size: 20px;
  width: 500px;
  height: auto;
  min-height: 200px;
}
.footer {
  padding: 20px;
}
.box_element_list {
  border-radius: 0.5ch;
  margin-top: 10px;
  padding-top: 1.5ch;
  padding-bottom: 1.5ch;
  -webkit-user-drag:table;
}
.draggable_icon {
  margin-right: 1ch;
  margin-left: 1ch;
}
.moving-card {
  opacity: 100%;
  background-color: rgba(0, 0, 0, 0.685);
  border: 10px;
  border-color: rgb(255, 0, 0);
}
</style>
