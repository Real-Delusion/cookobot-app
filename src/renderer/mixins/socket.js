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
            client.on('issue', (table,message) => {
                this.issueReceived(table, message)
            });
        });

        // Listen on port 3000
        io.listen(3000);
    },
    methods: {
        clientConnected: function () {
            console.log("Client connected")
        },
        issueReceived: function (table, message) {
            console.log('Issue received: ', table, message);
            this.issue = true;
            this.tableIssue = table;
            this.issueTopic = message;
        },
    }
}
