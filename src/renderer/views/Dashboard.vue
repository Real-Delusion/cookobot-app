<template>
  <div id="wrapper">
    <SlideMenu></SlideMenu>
    <section>
      <LiveMap></LiveMap>
      <TableList></TableList>
    </section>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";
import TableList from "@/components/OrderTables/TableList";
import SlideMenu from "@/components/UI/SlideMenu";

export default {
  name: "dashboard",
  components: { LiveMap, TableList, SlideMenu },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>
