<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
    <main>
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h3>ROS Connection</h3>
                <hr />
                <label>ROSBridge address</label>
                <br />
                <input type="text" v-model="rosbridge_address" />
                <br />
                <button class="mt-2 btn btn-success" v-if="connected" @click="disconnect">Connected!</button>
                <button class="mt-2 btn btn-primary" v-else @click="connect">Connect!</button>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <h2 class="text-center">Robot Control Area</h2>
                <hr />
                <p>Some actions to move the Robot</p>
                <button
                  class="mt-2 btn btn-primary"
                  :disabled="!connected"
                  @click="sendCommand"
                >Move the Robot!</button>
                <button
                  class="mt-2 btn btn-primary"
                  :disabled="!connected"
                  @click="sendTurnRight"
                >Turn right!</button>
                <button
                  class="mt-2 btn btn-primary"
                  :disabled="!connected"
                  @click="sendStop"
                >Stop the Robot!</button>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import ROSLIB from 'roslib';

export default {
  name: "landing-page",
  components: { SystemInformation },
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
          console.log(message);
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
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
