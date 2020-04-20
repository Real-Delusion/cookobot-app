<template>
  <div id="wrapper">
    <SlideMenu></SlideMenu>
    <section>
      <div class="columns is-marginless">
        <div class="column is-full has-margin-7 robot-buttons" style="height: 13vh">
          <RobotButton
            v-for="robot in robots"
            v-bind:id="robot.id"
            v-bind:description="robot.description"
            v-bind:bgcolor="robot.color"
            v-bind:key="robot.id"
            v-bind:style="{ 'margin-right': '1rem'}"
          ></RobotButton>
        </div>
      </div>
      <div class="columns is-marginless">
        <div class="column is-two-thirds has-margin-7" style="height: 87vh">
          <LiveMap></LiveMap>
        </div>
        <div class="column has-margin-7" style="height: 87vh">
          <TableList></TableList>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";
import TableList from "@/components/OrderTables/TableList";
import SlideMenu from "@/components/UI/SlideMenu";
import RobotButton from "@/components/UI/RobotButton";

export default {
  name: "dashboard",
  components: { LiveMap, TableList, SlideMenu, RobotButton },
  data() {
    return {
      robots: [
        { id: "123456", description: "kitchen", color: "var(--robot1)" },
        { id: "789023", description: "terrace", color: "var(--robot2)" }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped>
.robot-buttons {
  padding: 1rem;
  padding-top: 1.75rem;
  padding-left: 0.75rem;
}
</style>
