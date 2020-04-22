<template>
  <button @click="addTable(table)" v-bind:class="[buttonSelected ? 'selected' : '']">
    <p v-if="table.id!=0">{{ table.id }}</p>
    <p v-else>Kitchen</p>
  </button>
</template>

<script>
// import bus for events
import { bus } from "../../main";

export default {
  mixins: [],
  props: ["table", 'selected'],
  data() {
    return {
      buttonSelected: this.selected
    };
  },
  created: async function() {
    bus.$on("deleteTables", tables => {
      //if the list of tables is cancelled
      this.buttonSelected = false;
      console.log("tables deleted")
    });
    bus.$on("deleteTable", table => {
      //if the table is deleted from the list
      if (table == this.table.id) {
        this.buttonSelected = false;
        console.log("table deleted")
      }
    });
  },
  methods: {
    addTable: function(table) {
      //Send table value to TableList
      this.buttonSelected = !this.buttonSelected;
      bus.$emit("tableAdded", table);
      console.log("table added")
    }
  }
};
</script>

<style scoped>
.table_button {
  color: white;
  position: absolute;
  background-color: var(--darkbackground);
  border: 4px solid white;
  border-radius: 0.7rem;
  font-size: 2rem;

  /*box-shadow: 0 2px rgb(22, 22, 22);*/
}
.table_button:active {
  color: var(--darkbackground);
  box-shadow: 0 2px rgb(22, 22, 22);
  transform: translateY(2px);
}

.single {
  width: 7.5vw;
  height: 7.5vw;
}
.double_horizontal {
  width: 12vw;
  height: 7.5vw;
}
.double_vertical {
  width: 7.5vw;
  height: 12vw;
}
.kitchen {
  width: 15vw;
  height: 8vw;
}
.selected {
  background-color: white;
  color: black;
}
</style>
