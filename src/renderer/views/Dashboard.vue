<template>
  <div id="wrapper">
    <main>
      <div>
        <h3>ROS Connection</h3>
        <hr />
        <label>ROSBridge address</label>
        <input type="text" v-model="rosbridge_address" />
        <button v-if="connected" @click="disconnect">Connected!</button>
        <button v-else @click="connect">Connect!</button>
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
      <div id="main">
        <img id="map" src="@/assets/restaurante.png" alt />
        <button
          :disabled="!connected"
          style="left: 225px;top: 146px;"
          class="table_button"
          @click="goToTable(1)"
        >1</button>
        <button
          :disabled="!connected"
          style="left: 465px;top: 312px;"
          class="table_button"
          @click="goToTable(2)"
        >2</button>
        <button
          :disabled="!connected"
          style="left: 560px;top: 94px;"
          class="table_button table_double"
          @click="goToTable(3)"
        >3</button>
        <button
          :disabled="!connected"
          style="left: 755px;top: 312px;"
          class="table_button"
          @click="goToTable(4)"
        >4</button>
        <button
          :disabled="!connected"
          style="left: 469px;top: 673px;"
          class="kitchen_button"
          @click="goToTable(0)"
        >Cocina</button>
      </div>
    </main>
  </div>
</template>

<script>
//import ROSLIB from "roslib";

export default {
  name: "dashboard",
  components: {},
  data() {
    return {
      // ros connection
      ros: null,
      rosbridge_address: "ws://127.0.0.1:9090/",
      connected: false,
      // Subscriber data
      position: { x: 0, y: 0, z: 0 },
      // page content
      menu_title: "Connection",
      main_title: "Main title, from Vue!!"
    };
  },
  methods: {
    connect: function() {
      // define ROSBridge connection object
      this.ros = new ROSLIB.Ros({
        url: this.rosbridge_address
      });

      // define callbacks
      this.ros.on("connection", () => {
        this.connected = true;
        console.log("Connection to ROSBridge established!");
        let topic = new ROSLIB.Topic({
          ros: this.ros,
          name: "/odom",
          messageType: "nav_msgs/Odometry"
        });
        topic.subscribe(message => {
          this.position = message.pose.pose.position;
          //console.log(message);
        });
      });
      this.ros.on("error", error => {
        console.log("Something went wrong when trying to connect");
        console.log(error);
      });
      this.ros.on("close", () => {
        this.connected = false;
        console.log("Connection to ROSBridge was closed!");
      });
    },
    disconnect: function() {
      this.ros.close();
    },
    goToTable: function(table) {
      // define the service to be called
      let service = new ROSLIB.Service({
        ros: this.ros,
        name: "navegacion_autonoma_servicio",
        serviceType: "rossrv/Type"
      });

      // define the request
      let request = new ROSLIB.ServiceRequest({
        numeroMesa: table
      });

      service.callService(
        request,
        result => {
          console.log("This is the response of the service ");
          console.log(result);
        },
        error => {
          console.error(error);
        }
      );
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
body {
  padding: 0px;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
}

a {
  color: #00b7ff;
}
#map {
  max-height: 90vh;
  width: 925px;
}
#main {
  text-align: center;
  position: relative;
  display: inline-block;
}
.table_button {
  float: left;
  position: absolute;
  background-color: white;
  border: 4px solid black;
  border-radius: 29px;
  font-size: 37px;
  width: 116px;
  height: 116px;
  box-shadow: 0 2px rgb(22, 22, 22);
}
.table_button:hover {
  background-color: #00b7ff;
}
.table_button:active {
  color: white;
  box-shadow: 0 2px rgb(22, 22, 22);
  transform: translateY(2px);
}
.table_double {
  width: 226px;
}

.kitchen_button {
  float: left;
  position: absolute;
  background-color: white;
  border: 4px solid black;
  font-size: 37px;
  width: 431px;
  height: 116px;
  box-shadow: 0 2px rgb(22, 22, 22);
  height: 185px;
}
.kitchen_button:hover {
  background-color: #00b7ff;
}
.kitchen_button:active {
  color: white;
  box-shadow: 0 2px rgb(22, 22, 22);
  transform: translateY(2px);
}
</style>
