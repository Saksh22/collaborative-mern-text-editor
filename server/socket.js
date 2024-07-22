const socketIo = require('socket.io');

const initializeSocket = (server) =>{
    const io = socketIo(server, {
        cors: {
          origin: 'http://localhost:3000', // Your client URL
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          credentials: true
        }});

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinDocument',(documentId) => {
            socket.join(documentId);
            console.log(`Client joined document: ${documentId}`);
        });

        socket.on('editDocument', ({ documentId, content }) => {
            console.log(`Edit received for document ${documentId}: ${content}`);
            socket.to(documentId).emit('receiveEdit', content);
          });
      
          socket.on('disconnect', () => {
            console.log('Client disconnected');
          });
    });
};

module.exports = initializeSocket;