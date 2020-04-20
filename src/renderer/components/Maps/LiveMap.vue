<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="loading" v-show="!connected">
          <progress class="progress is-small is-primary" max="100">15%</progress>
          <p>Loading map ...</p>
        </div>
        <div v-show="connected">
          <div class="columns">
            <div class="column has-text-centered">
              <img id="map" ref="map" src="@/assets/restaurantMap.png" alt />
              <font-awesome-icon
                icon="robot"
                v-bind:style="{bottom: robotBottom+'px', left: robotLeft+'px' }"
                id="robotIndicator"
                style="font-size: 4rem"
              />
            </div>
          </div>
          <!-- I create the TableButton component -->
          <TableButton
            v-for="button in buttons"
            v-bind:table="button.tableNumber"
            v-bind:style="button.style"
            v-bind:key="button.tableNumber"
          ></TableButton>
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
        { tableNumber: 0, x: 4.63, y: 1.64, style: null },
        { tableNumber: 1, x: 4.28, y: 3.24, style: null },
        { tableNumber: 2, x: 2.35, y: 3.25, style: null },
        { tableNumber: 3, x: 3.83, y: 4.65, style: null },
        { tableNumber: 4, x: 2.37, y: 4.7, style: null },
        { tableNumber: 5, x: 0.92, y: 4.7, style: null }
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

    // TODO: Remove events
    bus.$on("sendTables", async table => {
      console.log("Enviando mesa:" + table);
      let res = await this.goToTable(parseInt(table));
      bus.$emit("sendRes", res);
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
  mounted: function () {
    this.calcTablePos()
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
        this.buttons[i].style = {left: pos.left + "px",bottom: pos.bottom + "px"}; // Update pos
      }
    },
    calcPos: function(x, y) {
      let realMapSize = { x: 5.26, y: 5.27 }; // Map size in coords

      // Calc new left and bottom using a simple rule of three
      let left = ((x * this.$refs.map.width) / realMapSize.x).toFixed(2);
      let bottom = ((y * this.$refs.map.height) / realMapSize.y).toFixed(2);
      
      // Return result
      return { left: left, bottom: bottom };
    },
    goToTable: function(table) {
      return new Promise((resolve, reject) => {
        console.log("ESTOY DENTRO DE GO TO TABLE");

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
            resolve(result);
          },
          error => {
            console.error(error);
            reject(error);
          }
        );
      });
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

<style scoped>
.card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
a {
  color: #00b7ff;
}
#map {
  width: 100%;
  height: auto;
}
.table_button:hover {
  background-color: #00b7ff;
}
.table_button:active {
  color: white;
  box-shadow: 0 2px rgb(22, 22, 22);
  transform: translateY(2px);
}
.kitchen_button {
  float: left;
  position: absolute;
  background-color: white;
  border: 4px solid black;
  font-size: 37px;
  width: 463px;
  height: 116px;
  box-shadow: 0 2px rgb(22, 22, 22);
  height: 199px;
}

#robotIndicator {
  position: absolute;
  width: 50px;
  z-index: 90;
}
.loading {
  text-align: center;
}
</style>
