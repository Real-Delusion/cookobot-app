<template>
  <div class="card queue_list">
    <header class="card-header">
    <p class="card-header-title">
      Robot 98R2X3
    </p>
    <a href="#" class="card-header-icon" aria-label="more options">
      <span class="icon">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </a>
  </header>
  <div class="card-content">
    <draggable group="people" @start="drag=true" @end="drag=false">
      <div v-for="detail in details" :key="detail">{{detail}}</div>
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
import { bus } from '../../main'
import draggable from 'vuedraggable'

export default {
  mixins: [],
  components: {
            draggable,
        },
  data() {
    return {
      details:[]
    };
  },

  created: async function() {
    bus.$on('tableAdded', (table) => {
        //Adding data to the list
        //console.log("Table: " + this.details.includes("Table " + table))
        if(this.details.includes("Table " + table)){
          this.details.splice(this.details.indexOf("Table " + table), 1);
        }else{
          this.details.push("Table " + table)
        }
      })
  },

  methods: {
    addTable: function() {
      details.push(table)
      console.log(details)
    }
  }
};
</script>

<style scoped>
.queue_list {
  float: left;
  left: 950px;
  top: 50px;
  position: absolute;
  font-size: 20px;
  width: 500px;
  height:auto;
  min-height:100px;
}
.footer{
  padding: 20px;
}

</style>
