/*------------------------------------
----------- Arm Controller -----------
-------------------------------------*/

import Ros from "@/mixins/ros.js";

export default {
    mixins: [Ros],
    data() {
        return {
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
    methods: {
        moveJoin: async function (joint, goal) {
            // Create move topic
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/' + this.arm.topics[joint] + '/command',
                messageType: 'std_msgs/Float64'
            })

            // Initial arm position
            let initPos = this.arm.positions[joint];

            // Movement config
            let increment = 0.01 // Effort per iteration
            let interval = 50; // Time between iterations

            // Move joint
            if (Math.sign(goal) == 1) {
                for (initPos; initPos < goal; initPos += increment) {
                    let message = new ROSLIB.Message({
                        data: initPos
                    })
                    topic.publish(message)
                    await new Promise(r => setTimeout(r, interval));
                }
            }
            if (Math.sign(goal) == -1) {
                for (initPos; initPos > goal; initPos -= increment) {
                    let message = new ROSLIB.Message({
                        data: initPos
                    })
                    topic.publish(message)
                    await new Promise(r => setTimeout(r, interval));
                }
            }
        },
        moveArm: function (goals) {
            // 0 --> Elbow, 1 -> Shoulder, 2 --> Wrist
            return new Promise(async (resolve, reject) => {

                for (let i = 0; i < goals.length; i++) {
                    this.moveJoin(i, goals[i]);
                }

                // To do: detect end of movement
                await new Promise(r => setTimeout(r, 10000));
                resolve();

                /*while (true) {
                    if (((Math.abs(this.arm.positions[2]) - Math.abs(goals[2])) < 0.2)) {
                        break;
                    }
                }*/
            })
        },
        serveArm: function () {
            return new Promise(async (resolve, reject) => {
                console.log("started")
                await this.moveArm([-0.1, 0.01,2]);
                console.log("finished")
                resolve()
            })
        },
        foldArm: function () {
            return new Promise(async (resolve, reject) => {
                await this.moveArm([2.13, -2.33, 1.4]);
                resolve()
            })
        }
    }
}
