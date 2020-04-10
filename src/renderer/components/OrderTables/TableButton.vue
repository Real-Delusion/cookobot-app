<template>
    <button
    style="left: 100px;top: 146px;" 
    class="table_button"
    @click="addTable(1)"
    >P</button>
</template>

<script>
// import bus for events
import { bus } from '../../main'

export default {
  mixins: [],
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
