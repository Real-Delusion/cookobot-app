/*------------------------------------
----------- Polly Controller -----------
-------------------------------------*/

import Ros from "@/mixins/ros.js";

export default {
    mixins: [Ros],
    data() {
        return {
            pollyGoal: null,
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
    methods: {
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
            console.log("ACION PLLY EJECUTADA")
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
        }
    }
}