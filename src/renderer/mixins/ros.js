export default {
    data() {
        return {
            // ros connection
            ros: null,
            rosbridge_address: "ws://127.0.0.1:9090/",
            connected: false,
        }
    },
    created: function () {

    },
    methods: {
        connectRos: function () {
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
        disconnect: function () {
            this.ros.close();
        }
    }
}