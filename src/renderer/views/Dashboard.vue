<template>
  <div id="wrapper">
    <main>
      <LiveMap></LiveMap>
      <TableList></TableList>
    </main>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";
import TableList from "@/components/OrderTables/TableList";


export default {
  name: "dashboard",
  components: {LiveMap, TableList},
  data() {
    return {
    };
  },
  methods: {

  }
};
</script>

<style>
</style>
