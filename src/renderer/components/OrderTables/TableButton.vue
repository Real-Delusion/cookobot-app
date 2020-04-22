<template>
  <button
    @click="addTable(table)"
    v-bind:value="table"
    v-bind:style="{ 'background-color': backgroundColor, 'color': textColor}"
    v-on:click="changeColor($event)"
  >
    <p v-if="table!=0">{{ table }}</p>
    <p v-else>Kitchen</p>
  </button>
</template>

<script>
// import bus for events
import { bus } from "../../main";

export default {
  mixins: [],
  props: ["table"],
  data() {
    return {
      backgroundColor: "var(--darkbackground)",
      buttonsEvents: [],
      textColor: "white"
    };
  },
  created: async function() {
    bus.$on("deleteTables", tables => {
      //if the list of tables is cancelled
      if (tables == 0) {
        this.backgroundColor = "var(--darkbackground)";
      }
    });
    bus.$on("deleteTable", table => {
      //if the table is deleted from the list
      //this.selected=false;
      for (var i = 0; i < this.buttonsEvents.length; i++) {
        if (this.buttonsEvents[i].value == table) {
          this.buttonsEvents[i].style.backgroundColor = "var(--darkbackground)";
          this.backgroundColor = "var(--darkbackground)";
          this.buttonsEvents[i].style.color = "white";
        }
      }
    });
  },
  methods: {
    addTable: function(table) {
      //Send table value to TableList
      bus.$emit("tableAdded", table);
    },
    changeColor: function(event) {
      if (!this.buttonsEvents.includes(event.currentTarget)) {
        this.buttonsEvents.push(event.currentTarget);
      }

      if (this.backgroundColor == "white") {
        var style = getComputedStyle(document.body);
        this.backgroundColor = "var(--darkbackground)";
        this.textColor = "white";
      } else {
        this.textColor = "var(--darkbackground)";
        this.backgroundColor = "white";
      }
    }
  }
};
</script>

<style scoped>
.table_button {
  color: white;
  position: relative;
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
</style>
