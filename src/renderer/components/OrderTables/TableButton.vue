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
  props: {
    table:{
        type: String
    }
  },
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
</style>
