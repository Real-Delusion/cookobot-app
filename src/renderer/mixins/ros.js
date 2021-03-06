export default {
    mixins: [],
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
            predictionGoal: null,
            pollyGoal: null,
            arm: {
                topics: [
                    "arm_elbow_flex_controller",
                    "arm_shoulder_lift_controller",
                    "arm_wrist_flex_controller"
                ],
                positions: [0, 0, 0]
            },
            action_polly: {
                goal: {  
                    nombreArchivo: "",
                    texto: "",
                    funcion: 0,
                },
                feedback: {  
                    time_elapsed: 0
                },
                result: { 
                    success: null,
                },
                status: { 
                    status: 0, text: '' 
                },
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

                // polly initial conf -----------------------------------------------------------------
                this.runPollyAction('','',0)
                console.log("Polly Action Client created!")


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
                    setTimeout(resolve, 10000);
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
        },
        runPollyAction: function(nombreArchivo, texto, funcion) {
            let actionClient = new ROSLIB.ActionClient({
                ros : this.ros,
                serverName : '/awsPolly',
                actionName : 'aws_polly_action/AwsPolly'
            })

            this.pollyGoal = new ROSLIB.Goal({
                actionClient : actionClient,
                goalMessage: {
                    nombreArchivo: nombreArchivo,
                    texto: texto,
                    funcion: funcion,

                }
            })

            this.pollyGoal.on('status', (status) => {
                this.action_polly.status= status
            })

            this.pollyGoal.on('feedback', (feedback) => {
                this.action_polly.feedback= feedback.time_elapsed

            })
            this.pollyGoal.send()
            console.log("ACION PoLLY EJECUTADA")
        },
        cancelPollyGoal: function() {
            this.pollyGoal.cancel()
        },

        awaitPolly: function () {
            return new Promise((resolve, reject) => {
                this.pollyGoal.on('status', (status) => {
                    if (status.status == 3) {
                        resolve(true)
                        console.log("Resolved")
                    }
                    else if (status.status == 4 || status.status == 5) {
                        console.log("ERROR ", status.status)
                        resolve(false)
                    }
                })
            })
        },
    }
}
