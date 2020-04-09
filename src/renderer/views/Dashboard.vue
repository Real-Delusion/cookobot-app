<template>
  <div id="wrapper">
    <main>
      <div>
        <button v-if="connected" @click="disconnect">Connected!</button>
        <button v-else @click="connect">Connect!</button>
        <button :disabled="!connected" @click="sendStop">Stop the Robot!</button>
        <span>X: {{ position.x.toFixed(2) }}</span>
        <span>Y: {{ position.y.toFixed(2) }}</span>
        <span>Z: {{ position.z.toFixed(2) }}</span>
        <hr />
      </div>
      <LiveMap></LiveMap>
    </main>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";
import Ros from "@/mixins/ros.js"

export default {
  name: "dashboard",
  components: {LiveMap},
  mixins: [Ros],
  data() {
    return {
      position: { x: 0, y: 0, z: 0 },
    };
  },
  methods: {
    connect: function() {
      this.connectRos()
    },
    sendStop: function() {
      let topic = new ROSLIB.Topic({
        ros: this.ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist"
      });
      let message = new ROSLIB.Message({
        linear: { x: 0, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0 }
      });
      topic.publish(message);
    }
  }
};
</script>

<style>
</style>
