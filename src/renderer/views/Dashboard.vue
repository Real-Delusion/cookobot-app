<template>
  <div id="wrapper">
    <main>
      <div>
        <h3>ROS Connection</h3>
        <hr />
        <label>ROSBridge address</label>
        <input type="text" v-model="rosbridge_address" />
        <button v-if="connected" @click="disconnect">Connected!</button>
        <button v-else @click="connectRos">Connect!</button>
      </div>
      <div>
        <button :disabled="!connected" @click="sendCommand">Move the Robot!</button>
        <button :disabled="!connected" @click="sendTurnRight">Turn right!</button>
        <button :disabled="!connected" @click="sendStop">Stop the Robot!</button>
        <hr />
        <p>Subscribing robot data</p>
        <p>
          <span>X: {{ position.x.toFixed(2) }}</span>
          <br />
          <span>Y: {{ position.y.toFixed(2) }}</span>
          <br />
          <span>Z: {{ position.z.toFixed(2) }}</span>
        </p>
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
    connectRos: function() {
     this.connect()
    },
    sendCommand: function() {
      let topic = new ROSLIB.Topic({
        ros: this.ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist"
      });
      let message = new ROSLIB.Message({
        linear: { x: 1, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0.5 }
      });
      topic.publish(message);
    },

    sendTurnRight: function() {
      let topic = new ROSLIB.Topic({
        ros: this.ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist"
      });
      let message = new ROSLIB.Message({
        linear: { x: -1, y: 0, z: 0 },
        angular: { x: 0, y: 0, z: 0.5 }
      });
      topic.publish(message);
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
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
</style>
