/*------------------------------------
---------- Socket.io Server ----------
-------------------------------------*/

// Import socket.io
const io = require('socket.io')();

export default {
    data() {
        return {
            tableIssue: "",
            issueTopic: "",
            issue: false,
        }
    },
    created: function () {
        // On client connected
        io.on('connection', client => {
            this.clientConnected();

            // Receive issue event
            client.on('issue', (msg) => {
                this.issueReceived()
            });
        });

        // Listen on port 3000
        io.listen(3000);
    },
    methods: {
        clientConnected: function () {
            console.log("Client connected")
        },
        issueReceived: function (msg) {
            console.log('Issue received: ' + msg);
            this.issue = true;
        },
    }
}
