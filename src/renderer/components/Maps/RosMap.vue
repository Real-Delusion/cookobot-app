<template>
  <div id="rosmap"></div>
</template>

<script>
//import ROS2D from "ros2d";
//import ROSLIB from "roslib";
import Ros from "@/mixins/ros.js";

export default {
  mixins: [Ros],
  data() {
    return {
      mapViewer: null,
      mapGridClient: null,
      interval: null
    };
  },
  created: async function() {
    await this.connectRos();
    this.initMap();
  },
  methods: {
    initMap: function() {
      this.mapViewer = new ROS2D.Viewer({
        divID: "rosmap",
        width: 420,
        height: 360
      });

      // Setup the map client.
      this.mapGridClient = new ROS2D.OccupancyGridClient({
        ros: this.ros,
        rootObject: this.mapViewer.scene,
        continuous: true
      });
      // Scale the canvas to fit to the map
      this.mapGridClient.on("change", () => {
        this.mapViewer.scaleToDimensions(
          this.mapGridClient.currentGrid.width,
          this.mapGridClient.currentGrid.height
        );
        this.mapViewer.shift(
          this.mapGridClient.currentGrid.pose.position.x,
          this.mapGridClient.currentGrid.pose.position.y
        );
      });
    }
  }
};
</script>

<style scoped>
</style>
