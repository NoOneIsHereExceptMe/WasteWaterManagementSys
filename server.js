const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store the latest sensor data
let latestSensorData = {
  temperature: 0,
  turbidity: 0,
  pH: 0,
  tds: 0,
  flowRate: 0,
  mq9Gas: 0,
  mq135Gas: 0,
  timestamp: Date.now(),
  deviceId: null
};

// Store historical data for graphs (last 100 readings)
const historicalData = {
  temperature: [],
  turbidity: [],
  pH: [],
  tds: [],
  flowRate: [],
  mq9Gas: [],
  mq135Gas: [],
  timestamps: []
};

// Maximum number of historical data points to keep
const MAX_HISTORY = 100;

// Store active component state
let componentActive = false;

// API endpoint to receive sensor data from ESP32
app.post('/api/sensor-data', (req, res) => {
  const data = req.body;
  
  // Update latest sensor data
  latestSensorData = {
    ...data,
    timestamp: Date.now()
  };
  
  // Add to historical data
  historicalData.temperature.push(data.temperature);
  historicalData.turbidity.push(data.turbidity);
  historicalData.pH.push(data.pH);
  historicalData.tds.push(data.tds);
  historicalData.flowRate.push(data.flowRate);
  historicalData.mq9Gas.push(data.mq9Gas);
  historicalData.mq135Gas.push(data.mq135Gas);
  historicalData.timestamps.push(Date.now());
  
  // Trim arrays if they exceed maximum length
  if (historicalData.temperature.length > MAX_HISTORY) {
    historicalData.temperature.shift();
    historicalData.turbidity.shift();
    historicalData.pH.shift();
    historicalData.tds.shift();
    historicalData.flowRate.shift();
    historicalData.mq9Gas.shift();
    historicalData.mq135Gas.shift();
    historicalData.timestamps.shift();
  }
  
  // Broadcast updated data to all connected clients
  io.emit('sensorUpdate', {
    latest: latestSensorData,
    historical: historicalData
  });
  
  res.status(200).json({ status: 'success' });
});

// API endpoint for ESP32 to check for commands
app.get('/api/commands', (req, res) => {
  const deviceId = req.query.deviceId;
  
  // Send current component state
  res.status(200).json({
    activateComponent: componentActive
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send current data to newly connected client
  socket.emit('initialData', {
    latest: latestSensorData,
    historical: historicalData,
    componentActive: componentActive
  });
  
  // Handle component activation from frontend
  socket.on('toggleComponent', (state) => {
    componentActive = state;
    io.emit('componentState', componentActive);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});