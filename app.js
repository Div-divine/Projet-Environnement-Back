import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import createHttpError from 'http-errors';

// Get routes
import indexRouter from './routes/index.js';
import userRouter from './routes/users.js';
import groupsRouter from './routes/groups.js';
import usersGroupsRouter from './routes/usersGroups.js'

const app = express();

// Enable CORS for all routes
app.use(cors());

// Body parser (configure it before defining routes)
app.use(bodyParser.json());

// Routes (define routes after configuring)
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/groups', groupsRouter);
app.use('/usergroups', usersGroupsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createHttpError(404));
});

// Set up the HTTP server with Express app
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST']
    }
});

// Create socket connection
io.on('connection', (socket) => {
    console.log(`User Connected in socket: ${socket.id}`)
    // Specify room id to identify users on each channel
    socket.on("join_room", (data) => {
        socket.join(data)
    })

    // Get message sent and resend it to the front 
    socket.on("send_msg", (data) => {
        socket.to(data.room).emit("received_msg", { message: data.message });
    })
})

// Define port for Express server
const PORT = process.env.SERVER_PORT || 3000;

// Start the combined server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket server is running on the same port as the HTTP server`);
});
