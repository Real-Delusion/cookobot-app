<template>
  <button
    class="robot-button"
    v-bind:id="id"
    v-bind:description="description"
    @click="selectRobot(robot)"
    v-on:click="changeColor($event)"
  >
    <div class="columns is-marginless">
      <div class="column robot-icon is-two-fifths">
        <span class="icon">
          <font-awesome-icon icon="robot" />
        </span>
      </div>
      <div class="column robot-text is-three-fifths">
        <div>
          <b>#{{id}}</b>
        </div>
        <div>Robot pasillo 1</div>
      </div>
    </div>
  </button>
</template>

<script>
// import bus for events
import { bus } from "../../main";

export default {
  mixins: [],
  props: ["id", "description"],
  data() {
    return {
      /* backgroundColor: "white",
      buttonsEvents: []*/
    };
  },
  created: async function() {
    /*  bus.$on("deleteTables", tables => {
      //if the list of tables is cancelled
      if (tables == 0) {
        this.backgroundColor = "white";
      }
    });
    bus.$on("deleteTable", table => {
      //if the table is deleted from the list
      for (var i = 0; i < this.buttonsEvents.length; i++) {
        if (this.buttonsEvents[i].value == table) {
          this.buttonsEvents[i].style.backgroundColor = "white";
          this.backgroundColor = "white";
        }
      }
    });*/
  },
  methods: {
    selectRobot: function(robot) {
      //Send table value to TableList
     // bus.$emit("robotSelected", robot);
    },
    changeColor: function(event) {
     /* if (!this.buttonsEvents.includes(event.currentTarget)) {
        this.buttonsEvents.push(event.currentTarget);
      }

      if (this.backgroundColor == "white") {
        this.backgroundColor = "#00b7ff";
      } else {
        this.backgroundColor = "white";
      }*/
    }
  }
};
</script>

<style scoped>
.robot-button {
  height: 100%;
  background: none;
  border: none;
  padding: 0;
}
.robot-button div {
  height: 100%;
}

.robot-icon {
  background-color: var(--robot1);
  border-radius: 0.5rem 0 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: white;
}
.robot-text {
  background-color: white;
  border-radius: 0 0.5rem 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1rem;
  align-items: flex-start;
}
.icon {
  padding: 2.5rem;
}
.robot-text div {
  height: auto;
}
</style>
