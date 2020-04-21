<template>
  <div class="control robot-buttons">
    <label class="radio" v-for="robot in robots" v-bind:key="robot.id">
      <input type="radio" name="robotbuttons" v-bind:value="robot.id" @change="onChange($event)" />
      <RobotButton
        v-bind:selected="robot.selected"
        v-bind:id="robot.id"
        v-bind:description="robot.description"
        v-bind:bgcolor="robot.color"
        v-bind:style="{'margin-right': '1rem'}"
      ></RobotButton>
    </label>
  </div>
</template>

<script>
import RobotButton from "@/components/UI/ShowRobots/RobotButton";

export default {
  mixins: [],
  components: { RobotButton },
  data() {
    return {
      selectedRobot: "",
      robots: [
        {
          id: "123456",
          description: "kitchen",
          color: "var(--robot1)",
          selected: true
        },
        {
          id: "789023",
          description: "terrace",
          color: "var(--robot2)",
          selected: false
        }
      ]
    };
  },
  created: async function() {},
  methods: {
    onChange: function(event) {
      this.robots.forEach(element => {
        if (element.id != event.target.value) {
          element.selected = false;
        } else element.selected = true;
      });
    }
  }
};
</script>

<style scoped>
.robot-buttons {
  padding: 1rem;
  padding-top: 0.5rem;
  padding-left: 0.75rem;
}

.radio input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0
}

.radio input[type="radio"] + div[selected="selected"] {
  border: 0.5rem solid white;
  border-radius: 0.7rem;
  -webkit-box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
  -moz-box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
  box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
}
</style>
