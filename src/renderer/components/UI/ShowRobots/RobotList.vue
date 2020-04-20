<template>
  <div class="control robot-buttons">
    <label class="radio" v-for="robot in robots" v-bind:key="robot.id">
      <input type="radio" name="foobar" />
      <RobotButton
        v-bind:id="robot.id"
        v-bind:description="robot.description"
        v-bind:bgcolor="robot.color"
        v-bind:style="{ 'margin-right': '1rem'}"
      ></RobotButton>
    </label>
  </div>
</template>

<script>
// import bus for events
import RobotButton from "@/components/UI/ShowRobots/RobotButton";

export default {
  mixins: [],
  components: { RobotButton },
  data() {
    return {
      robots: [
        { id: "123456", description: "kitchen", color: "var(--robot1)" },
        { id: "789023", description: "terrace", color: "var(--robot2)" }
      ]
    };
  },
  created: async function() {},
  methods: {}
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
  width: 0;
}

.radio input[type="radio"]:checked + div {
  border: 0.5rem solid white;
  border-radius: 0.7rem;
  -webkit-box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
  -moz-box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
  box-shadow: 0px 0px 64px -1px rgba(0, 0, 0, 0.21);
}
.radio input[type="radio"]:checked + div:first-child .robot-text {
  border-radius: 0;
}
</style>
