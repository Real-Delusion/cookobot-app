<template>
  <div id="wrapper">
    <SlideMenu></SlideMenu>
    <section>
      <div class="columns is-marginless">
        <div class="column is-full has-margin-7" style="height: 10vh">
          <RobotButton
            v-for="robot in robots"
            v-bind:id="robot.id"
            v-bind:description="robot.description"
            v-bind:key="robot.id"
          ></RobotButton>
        </div>
      </div>
      <div class="columns is-marginless">
        <div class="column is-two-thirds has-margin-7">
          <LiveMap></LiveMap>
        </div>
        <div class="column has-margin-7">
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
        { id: "123456", description: "kitchen aid" },
        { id: "789023", description: "bar aid" }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>
