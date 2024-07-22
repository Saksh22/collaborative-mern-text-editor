const http = require('http');
const app = require('./index');
const dotenv = require('dotenv');
const initializeSocket = require('./socket');

dotenv.config();

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
