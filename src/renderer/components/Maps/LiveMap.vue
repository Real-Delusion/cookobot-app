<template>
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
</template>

<script>
import Ros from "@/mixins/ros.js"

export default {
  mixins: [Ros],
  data() {
    return {};
  },
  methods: {
    initMap: function (ros){

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
    }
  }
};
</script>

<style scoped>
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