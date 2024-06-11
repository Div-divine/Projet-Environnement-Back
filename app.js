import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import createHttpError from 'http-errors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

// Get routes
import indexRouter from './routes/index.js';
import userRouter from './routes/users.js';
import groupsRouter from './routes/groups.js';
import usersGroupsRouter from './routes/usersGroups.js';
import countRouter from './routes/count.js';
import chatRoomsrouter from './routes/chatRooms.js';
import userMsgRouter from './routes/messages.js';
import postsRouter from './routes/posts.js';
import friendsRouter from './routes/friends.js';
import fileUploadRouter from './routes/uploads.js';

// Set up __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors());

// Body parser (configure it before defining routes)
app.use(bodyParser.json());

// Serve static files from the public directory
const publicDirectoryPath = process.env.PUBLIC_PATH || path.join(__dirname, 'public/assets');
app.use('/assets', express.static(publicDirectoryPath));

// Routes (define routes after configuring)
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/groups', groupsRouter);
app.use('/usergroups', usersGroupsRouter);
app.use('/count', countRouter);
app.use('/chatroom', chatRoomsrouter);
app.use('/messages', userMsgRouter);
app.use('/posts', postsRouter);
app.use('/friends', friendsRouter);
app.use('/uploads', fileUploadRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createHttpError(404));
});

// Set up the HTTP server with Express app
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://site-environnement.d2wm.akoatic.ovh"
        ],
        methods: ['GET', 'POST']
    }
});

// Create socket connection
io.on('connection', (socket) => {
    console.log(`User Connected in socket: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        // Emit an event to notify the sender that the receiver has joined the chatroom
        io.to(data.senderId).emit("receiver_joined");
    });

    socket.on("send_msg", (data) => {
        socket.to(data.room).emit("received_msg", { message: data.message });
    });
});

// Define port for Express server
const PORT = process.env.SERVER_PORT || 3000;

// Start the combined server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket server is running on the same port as the HTTP server`);
});
