/*------------------------------------
---------- Socket.io Server ----------
-------------------------------------*/

// Import socket.io
const io = require('socket.io')();

// On client connected
io.on('connection', client => {
    console.log("Client connected")

    // Receive issue event
    client.on('issue', (msg) => {
        console.log('Issue received: ' + msg);
    });
});

// Listen on port 3000
io.listen(3000);

export default {
    io
}