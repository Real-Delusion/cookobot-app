<template>
  <div id="tablelist" class="queue_list">
    <ul>
      <li  v-for="detail in details" v-bind:key="detail">{{detail}}</li>
    </ul>
  </div>
</template>

<script>
// import bus for events
import { bus } from '../../main'

export default {
  mixins: [],
  data() {
    return {
      details:["Mesa 1", "Mesa 2"]
    };
  },

  created: async function() {
    bus.$on('tableAdded', (table) => {
        //Adding data to the list
        console.log("Mesa: " + table)
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
  background-color: white;
  border: 4px solid black;
  border-radius: 29px;
  font-size: 37px;
  width: 300px;
  height: 300px;
  box-shadow: 0 2px rgb(22, 22, 22);
}

</style>
