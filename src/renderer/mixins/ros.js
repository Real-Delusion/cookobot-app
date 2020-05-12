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
            connectionTries: 0,
            arm: {
                topics: [
                    "arm_elbow_flex_controller",
                    "arm_shoulder_lift_controller",
                    "arm_wrist_flex_controller"
                ],
                positions: [0, 0, 0]
            }
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

                    // Init arm topics subscription
                    for (let i = 0; i < this.arm.topics.length; i++) {
                        let topic = new ROSLIB.Topic({
                            ros: this.ros,
                            name: "/" + this.arm.topics[i] + "/state",
                            messageType: "control_msgs/JointControllerState"
                        });
                        topic.subscribe(message => {
                            //console.log(message.set_point);
                            this.arm.positions[i] = message.set_point;
                        });

                    }

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
        moveJoin: function (joint, goal) {
            // Create move topic
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/' + this.arm.topics[joint] + '/command',
                messageType: 'std_msgs/Float64'
            })

            // Initial arm position
            let initPos = this.arm.positions[joint];

            let timeSpace = 0;

            if (Math.sign(goal) == 1) {
                for (initPos; initPos < goal; initPos += 0.01) {
                    timeSpace += 50;
                    setTimeout(() => {
                        let message = new ROSLIB.Message({
                            data: initPos
                        })
                        topic.publish(message)
                    }, timeSpace);
                }
            }
            if (Math.sign(goal) == -1) {
                for (initPos; initPos > goal; initPos -= 0.01) {
                    timeSpace += 50;
                    setTimeout(() => {
                        let message = new ROSLIB.Message({
                            data: initPos
                        })
                        topic.publish(message)
                    }, timeSpace);
                }
            }
        },
        moveArm: function (goals) {
            // 0 --> Elbow, 1 -> Shoulder, 2 --> Wrist
            return new Promise((resolve, reject) => {

                for (let i = 0; i < goals.length; i++) {
                    this.moveJoin(i, goals[i]);
                }

                while (true) {
                    if (((Math.abs(this.arm.positions[2]) - Math.abs(goals[2])) < 0.2)) {
                        resolve();
                        break;
                    }
                }
            })
        },
        serveArm: function () {
            return new Promise(async (resolve, reject) => {
                console.log("started")
                await this.moveArm([1, 0.1, 1]);
                console.log("finished")
                resolve()
            })
        },
        foldArm: function () {
            return new Promise(async (resolve, reject) => {
                await this.moveArm([-1, -1, -1]);
                resolve()
            })
        }
    }
}
