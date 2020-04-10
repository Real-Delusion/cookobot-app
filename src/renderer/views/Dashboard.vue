<template>
  <div id="wrapper">
    <main>
      <LiveMap></LiveMap>
    </main>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";

export default {
  name: "dashboard",
  components: {LiveMap},
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
