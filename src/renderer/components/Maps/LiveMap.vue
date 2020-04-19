<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <div class="loading" v-if="!connected">
          <progress class="progress is-small is-primary" max="100">15%</progress>
          <p>Loading map ...</p>
        </div>
        <div v-if="connected">
          <div class="columns">
            <div class="column has-text-centered">
              <img id="map" src="@/assets/restaurantMap.png" alt />
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
            v-bind:style="{left: button.left + 'px',  
                  top: button.top + 'px'}"
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
        { tableNumber: 0, left: 540, top: 730 },
        { tableNumber: 1, left: 225, top: 146 },
        { tableNumber: 2, left: 465, top: 312 },
        { tableNumber: 3, left: 560, top: 94 },
        { tableNumber: 4, left: 755, top: 312 }
      ]
    };
  },
  watch: {
    position: function() {
      this.updateRobotPosition();
    }
  },
  created: async function() {
    await this.connectRos();
  },
  methods: {
    updateRobotPosition: function() {
      let x = this.position.x.toFixed(2);
      let y = this.position.y.toFixed(2);

      let width = document.getElementById('map').width;
      let height = document.getElementById('map').height;

      let xWidth = 5.26;
      let yHeight = 5.27;

      this.robotLeft = ((x * width) / xWidth).toFixed(2);
      this.robotBottom = ((y * height) / yHeight).toFixed(2);

      //console.log(this.robotLeft, this.robotTop)
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
  max-height: 80vh;
  width: 925px;
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
