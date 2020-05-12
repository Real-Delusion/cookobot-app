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
            rekognitionGoal: null,
            predictionGoal: null
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


                    // navegacion_autonoma_servicio
                    this.navService = new ROSLIB.Service({
                        ros: this.ros,
                        name: "navegacion_autonoma_servicio",
                        serviceType: "rossrv/Type"
                    });

                    console.log(" Navigation Service created!");

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

                });

                // rekognition_action_server -----------------------------------------------------------------
                var rekognitionClient = new ROSLIB.ActionClient({
                    ros: this.ros,
                    serverName: '/rekognition',
                    actionName: 'rekognition_action/RekognitionAction'
                });

                this.rekognitionGoal = new ROSLIB.Goal({
                    actionClient: rekognitionClient,
                    goalMessage: {}
                });

                console.log("Rekognition Action Client created!")

                // prediction_action_server -----------------------------------------------------------------
                var predictionClient = new ROSLIB.ActionClient({
                    ros: this.ros,
                    serverName: '/prediction',
                    actionName: 'prediction_action/PredictionAction'
                });

                this.predictionGoal = new ROSLIB.Goal({
                    actionClient: predictionClient,
                    goalMessage: {}
                });

                console.log("Prediction Action Client created!")


                // ros -----------------------------------------------------------------
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
        awaitPhoto: function () {
            return new Promise((resolve, reject) => {
                this.rekognitionGoal.on('status', (status) => {
                    if (status.status == 3) {
                        resolve(true)
                    }
                    else if (status.status == 4 || status.status == 5) {
                        console.log("ERROR ", status.status)
                        resolve(false)
                    }
                })
            })
        },
        awaitPrediction: function () {
            console.log("awaitprediction")
            return new Promise((resolve, reject) => {
                this.predictionGoal.on('result', (result) => {
                    resolve(result.table_number)
                })
            })
        },
        manualConnect() {
            this.failed = false;
            this.connectionTries = 0;
            this.connectRos();
        },
        disconnect: function () {
            this.ros.close();
        }
    }
}
