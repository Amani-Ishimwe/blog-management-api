// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws'); // Add this
const morgan = require('morgan');
const connectDB = require('./config/db');
const debug = require('debug')('app:server');
const config = require('config');
const blogRoutes = require('./routes/blog-routes');
const roleRoutes = require('./routes/role-routes');
const userRoutes = require('./routes/user-routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  Create HTTP server and attach WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store WebSocket instance globally (for controllers)
global._wss = wss;

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.send(JSON.stringify({ message: 'WebSocket connected' }));
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(process.env.PORT || config.get('port'), () => {
      debug(`Server is running on port ${config.get('port')}`);
    });
  } catch (error) {
    debug('Server startup error: ', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
