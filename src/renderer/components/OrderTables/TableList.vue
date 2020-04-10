<template>
  <div id="tablelist">
    
  </div>
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

    

    addTable: function() {
      bus.$on('tableAdded', (table) => {
        //Adding data to the list

      })
    }
  }
};
</script>

<style scoped>


</style>
