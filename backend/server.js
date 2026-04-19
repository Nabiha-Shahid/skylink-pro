const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const Redis = require('ioredis');

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: [frontendUrl, 'http://localhost:3000'] }));

const server = http.createServer(app);
const redis = new Redis(process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379/0');

const io = new Server(server, {
  cors: {
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Redis key helper
const getLockKey = (flightId, seatId) => `seat_lock:${flightId}:${seatId}`;

// --- Quantum 5 Fleet (Iconic International Routes) ---
const FLEET = [
  { id: "SK-412", start: [40.7128, -74.0060], end: [48.8566, 2.3522], steps: 5000, current: 0, price: 4220 }, // JFK -> CDG
  { id: "SK-770", start: [25.2048, 55.2708], end: [51.5074, -0.1278], steps: 4500, current: 1200, price: 1850 }, // DXB -> LHR
  { id: "SK-101", start: [35.6762, 139.6503], end: [34.0522, -118.2437], steps: 6000, current: 3500, price: 5400 }, // HND -> LAX
  { id: "SK-882", start: [1.3521, 103.8198], end: [-33.8688, 151.2093], steps: 3500, current: 800, price: 1200 }, // SIN -> SYD
  { id: "SK-559", start: [37.7749, -122.4194], end: [-0.1807, -78.4678], steps: 4000, current: 2200, price: 950 }  // SFO -> UIO
];

io.on('connection', (socket) => {
  console.log('Client connected to SkyLink Fleet Network:', socket.id);

  socket.on('joinFlight', (flightId) => {
    socket.join(`flight_${flightId}`);
    console.log(`User joined flight room: ${flightId}`);
  });

  socket.on('lockSeat', async ({ flightId, seatId, userId }) => {
    const lockKey = getLockKey(flightId, seatId);
    const success = await redis.set(lockKey, userId, 'EX', 300, 'NX');
    if (success) {
      io.to(`flight_${flightId}`).emit('seatStatusUpdate', { seatId, status: 'locked', userId });
    }
  });

  socket.on('releaseSeat', async ({ flightId, seatId, userId }) => {
    const lockKey = getLockKey(flightId, seatId);
    const lockedBy = await redis.get(lockKey);
    if (lockedBy === userId) {
      await redis.del(lockKey);
      io.to(`flight_${flightId}`).emit('seatStatusUpdate', { seatId, status: 'available', userId: null });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Broadcast Multi-Fleet Telemetry every 2 seconds
setInterval(() => {
  const telemetryFleet = FLEET.map(flight => {
    // 1. Calculate Progress
    const progress = flight.current / flight.steps;
    
    // 2. Coordinate Interpolation (Linear approximation for demo)
    const lat = flight.start[0] + (flight.end[0] - flight.start[0]) * progress;
    const lng = flight.start[1] + (flight.end[1] - flight.start[1]) * progress;
    
    // 3. Dynamic Altitude Arc
    const altitude = Math.floor(Math.sin(progress * Math.PI) * 35000);

    // 4. Yield Pricing Drift
    const drift = Math.floor(Math.random() * 5) - 2;
    flight.price += drift;
    if (flight.price < 500) flight.price = 800; // Floor

    // Increment Step
    flight.current = (flight.current + 1) % flight.steps;

    return {
      flightId: flight.id,
      latitude: lat.toFixed(4),
      longitude: lng.toFixed(4),
      altitude: Math.max(altitude, 0),
      yieldPrice: flight.price,
      progress: (progress * 100).toFixed(1)
    };
  });

  // Broadcast the entire fleet array
  io.emit('flightTelemetry', telemetryFleet);

}, 2000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`SkyLink Live Telemetry Node running on port ${PORT}`);
});
