<template>
  <div id="wrapper">
    <SlideMenu></SlideMenu>
    <section>
      <div class="columns is-marginless">
        <div class="column is-full has-margin-7" style="height: 13vh">
         <RobotList></RobotList>
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
import RobotList from "@/components/UI/ShowRobots/RobotList";

export default {
  name: "dashboard",
  components: { LiveMap, TableList, SlideMenu, RobotList },
  data() {
    return {
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>
