<template>
    <button
    class="table_button"
    v-bind:value="table"
    @click="addTable(table)"
    v-bind:style="{ 'background-color': backgroundColor }"
    v-on:click="changeColor">{{table}}</button>
</template>

<script>
// import bus for events
import { bus } from '../../main'

export default {
  mixins: [],
  props: ['table'],
  data() {
    return {
      backgroundColor:'white',
    };
  },
  created: async function() {
    bus.$on("deleteTables", tables => {
      //if the list of tables is cancelled
      if (tables == 0) {
        this.backgroundColor = 'white';
      } 
    });
  },
  methods: {
    addTable: function(table) {
      //Send table value to TableList
      bus.$emit('tableAdded', table);

    },
    changeColor: function() {
		  if (this.backgroundColor == 'white') {
			  this.backgroundColor = '#00b7ff';
		  } else {
			  this.backgroundColor = 'white';
		  }
    },
  }
};
</script>

<style scoped>
.table_button {
  float: left;
  position: absolute;
  background-color: white;
  border: 4px solid black;
  border-radius: 29px;
  font-size: 37px;
  width: 116px;
  height: 116px;
  box-shadow: 0 2px rgb(22, 22, 22);
}
.table_button:active {
  color: white;
  box-shadow: 0 2px rgb(22, 22, 22);
  transform: translateY(2px);
}
.table_double {
  width: 226px;
}
</style>
