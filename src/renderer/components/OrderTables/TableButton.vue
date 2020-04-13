<template>
    <button
    class="table_button"
    @click="addTable(table)"
    >{{table}}</button>
</template>

<script>
// import bus for events
import { bus } from '../../main'

export default {
  mixins: [],
  props: ['table'],
  data() {
    return {
      
    };
  },
  created: async function() {
    
  },
  methods: {
    addTable: function(table) {
    //Send table value to TableList
    bus.$emit('tableAdded', table);
    }
    
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
</style>
