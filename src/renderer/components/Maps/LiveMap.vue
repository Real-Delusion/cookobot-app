<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="loading" v-show="!connected && failed == false">
          <progress class="progress is-small is-primary" max="100">15%</progress>
          <p>Connecting to ROS server ...</p>
        </div>
        <div class="loading" v-show="failed">
          <p>Failed to connect server</p>
          <button v-on:click="manualConnect()" class="button is-primary">Try again</button>
        </div>
        <div v-show="connected">
          <div class="columns">
            <div class="column has-text-centered">
              <!-- <img id="map" ref="map" src="@/assets/restaurantMap.jpg" alt /> -->
              <div id="map" ref="map" class="restaurant">
                <!-- I create the TableButton component -->
                <TableButton
                  v-for="button in buttons"
                  v-bind:table="button"
                  v-bind:style="button.style"
                  v-bind:class="'table_button '+ button.type"
                  v-bind:key="button.id"
                  v-bind:selected="button.selected"

                ></TableButton>
              </div>
              <font-awesome-icon
                icon="robot"
                v-bind:style="{bottom: robotBottom+'px', left: robotLeft+'px' }"
                id="robotIndicator"
                style="font-size: 4rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ros from "@/mixins/ros.js";
import TableButton from "@/components/OrderTables/TableButton";
// import bus for events
import { bus } from "../../main";

export default {
  name: "livemap",
  components: { TableButton },
  mixins: [Ros],
  data() {
    return {
      robotLeft: 0,
      robotBottom: 0,
      //Table buttons
      buttons: [
        { id: 0, x: 4.63, y: 1.64, style: null, selected:false, type:' kitchen', served:false },
        { id: 1, x: 4.28, y: 3.24, style: null, selected:false, type:' single', served:false },
        { id: 2, x: 2.35, y: 3.25, style: null, selected:false, type:' single', served:false },
        { id: 3, x: 3.83, y: 4.65, style: null, selected:false, type:' double_horizontal', served:false },
        { id: 4, x: 2.37, y: 4.7, style: null, selected:false,  type:' single', served:false },
        { id: 5, x: 0.92, y: 4.7, style: null, selected:false,  type:' double_vertical', served:false }
      ]
    };
  },
  watch: {
    // On position change update robot position
    position: function() {
      this.updateRobotPosition();
    }
  },
  created: async function() {
    // Connect to rosbridge server
    await this.connectRos();

    bus.$on("sendTables", async table => {
      if (table != -1) {
        console.log("Enviando mesa:" + table);
        let res = await this.goToTable(parseInt(table));
        console.log("res se ha resuelto", res);
        bus.$emit("sendRes", res);
      } else {
        //this.sendStop();
      }
    });

    // Update tables position on window resize
    window.addEventListener("resize", this.calcTablePos);
    window.addEventListener("load", this.calcTablePos);
  },
  destroyed() {
    // Remove resize event
    window.removeEventListener("resize", this.calcTablePos);
    window.removeEventListener("load", this.calcTablePos);
  },
  mounted: function() {
    this.calcTablePos();
  },
  methods: {
    updateRobotPosition: function() {
      // Calc new pos
      let pos = this.calcPos(this.position.x, this.position.y);
      // Update pos
      this.robotLeft = pos.left;
      this.robotBottom = pos.bottom;
    },
    calcTablePos: function() {
      // For each table button
      for (let i = 0; i < this.buttons.length; i++) {
        let pos = this.calcPos(this.buttons[i].x, this.buttons[i].y); // Calc new pos
        this.buttons[i].style = {
          left: pos.left + "px",
          bottom: pos.bottom + "px"
        }; // Update pos
      }
    },
    calcPos: function(x, y) {
      let realMapSize = { x: 5.26, y: 5.27 }; // Map size in coords

      // Calc new left and bottom using a simple rule of three
      let left = (
        (x * this.$refs.map.width) / realMapSize.x +
        this.$refs.map.x
      ).toFixed(2);
      let bottom = ((y * this.$refs.map.height) / realMapSize.y).toFixed(2);

      // Return result
      return { left: left, bottom: bottom };
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
  }
  
};
</script>

<style scoped>
.card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#robotIndicator {
  position: absolute;
  width: 50px;
  z-index: 90;
}
.loading {
  text-align: center;
}
.restaurant{
  height: 45vw;
  width: 45vw;
  border:0.7rem solid black;
  background-color: var(--darkbackground);
}
</style>
