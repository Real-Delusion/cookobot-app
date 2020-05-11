export default {
    data() {
        return {
            // ros connection
            ros: null,
            //rosbridge_address: "ws://192.168.1.148:9090/",
            rosbridge_address: "ws://localhost:9090/",
            connected: false,
            position: { x: 0, y: 0, z: 0 },
            navService: null,
            failed: false,
            connectionTries: 0
        }
    },
    created: function () {

    },
    methods: {
        connectRos: function () {
            return new Promise((resolve, reject) => {
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

                    this.navService = new ROSLIB.Service({
                        ros: this.ros,
                        name: "navegacion_autonoma_servicio",
                        serviceType: "rossrv/Type"
                    });
                    console.log("Service created!");

                    // Fold arm
                    this.foldArm();
                });
                this.ros.on("error", error => {
                    console.log("Something went wrong when trying to connect");
                    console.log(error);
                });
                this.ros.on("close", () => {
                    this.connected = false;
                    console.log("Connection to ROSBridge was closed! Trying to reconnect ...");
                    if (this.connectionTries < 5) {
                        setTimeout(this.connectRos, 5000);
                        this.connectionTries++;
                    } else {
                        this.failed = true;
                    }
                });
                return resolve(0);
            });
        },
        manualConnect() {
            this.failed = false;
            this.connectionTries = 0;
            this.connectRos();
        },
        disconnect: function () {
            this.ros.close();
        },
        moveArm: function (part, goal) {

            // Get topic from part
            switch (part) {
                case "elbow":
                    part = "arm_elbow_flex_controller";
                    break;
                case "shoulder":
                    part = "arm_shoulder_lift_controller";
                    break;
                case "wrist":
                    part = "arm_wrist_flex_controller";
                    break;
                default:
                    break;
            }

            // Set topic
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/' + part + '/command',
                messageType: 'std_msgs/Float64'
            })

            let timeSpace = 0;
            if (Math.sign(goal) == 1) {
                for (let i = 0; i < goal; i += 0.01) {
                    timeSpace += 50;
                    setTimeout(() => {
                        let message = new ROSLIB.Message({
                            data: i
                        })
                        topic.publish(message)
                    }, timeSpace);
                }
            } else {
                for (let i = 0; i > goal; i -= 0.01) {
                    timeSpace += 50;
                    setTimeout(() => {
                        let message = new ROSLIB.Message({
                            data: i
                        })
                        topic.publish(message)
                    }, timeSpace);
                }
            }
        },
        foldArm: function () {
            setTimeout(this.moveArm('elbow', -1), 0);
            setTimeout(this.moveArm('shoulder', -1), 0);
            setTimeout(this.moveArm('wrist', -1), 0);
        }
    }
}
