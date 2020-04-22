<template>
  <div id="wrapper">
    <div v-show="issue" class="notification is-warning">
      <button @click="hideNotification()" class="delete"></button>
      <strong>Issue Received</strong>
      <br />
      Table {{tableIssue}} {{issueTopic}}
    </div>
    <SlideMenu></SlideMenu>
    <section>
      <div class="columns is-marginless">
        <div class="column is-full has-margin-7" style="height: 13vh">
          <RobotList></RobotList>
        </div>
      </div>
      <div class="columns is-marginless">
        <div class="column is-two-thirds has-margin-7" style="height: 87vh">
          <LiveMap></LiveMap>
        </div>
        <div class="column has-margin-7" style="height: 87vh">
          <TableList></TableList>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
//import ROSLIB from "roslib";
import LiveMap from "@/components/Maps/LiveMap";
import TableList from "@/components/OrderTables/TableList";
import SlideMenu from "@/components/UI/SlideMenu";
import RobotList from "@/components/UI/ShowRobots/RobotList";

import SocketServer from "@/mixins/socket.js";

export default {
  name: "dashboard",
  mixins: [SocketServer],
  components: { LiveMap, TableList, SlideMenu, RobotList },
  data() {
    return {
      notification: true,
    };
  },
  methods: {
    hideNotification() {
      this.issue = false;
    }
  }
};
</script>

<style scoped>
.notification {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 94;
}
</style>
