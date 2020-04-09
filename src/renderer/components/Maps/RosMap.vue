<template>
  <div id="rosmap"></div>
</template>

<script>
//import ROS2D from "ros2d";
//import ROSLIB from "roslib";

export default {
  data() {
    return {
      mapViewer: null,
      mapGridClient: null,
      interval: null
    };
  },
  methods: {
    initMap: function(ros) {
      this.mapViewer = new ROS2D.Viewer({
        divID: "rosmap",
        width: 420,
        height: 360
      });

      // Setup the map client.
      this.mapGridClient = new ROS2D.OccupancyGridClient({
        ros: ros,
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
