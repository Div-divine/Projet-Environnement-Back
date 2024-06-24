import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import createHttpError from 'http-errors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { verifyCsrfToken } from './middlewares/csrfTokenMiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Get routes
import indexRouter from './routes/indexRouter.js';
import userRouter from './routes/usersRouter.js';
import groupsRouter from './routes/groupsRouter.js';
import usersGroupsRouter from './routes/usersGroupsRouter.js';
import countRouter from './routes/countRouter.js';
import chatRoomsrouter from './routes/chatRoomsRouter.js';
import userMsgRouter from './routes/messagesRouter.js';
import postsRouter from './routes/postsRouter.js';
import friendsRouter from './routes/friendsRouter.js';
import fileUploadRouter from './routes/uploadsRouter.js';
import { sendConnectedUsersSSE } from './routes/connectedUsersRouter.js';
import csrfRouter from './routes/csrfRouter.js';
import FriendsDataRouter from './routes/dataFriends.js';

// Set up __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors());

// Body parser (configure it before defining routes)
app.use(bodyParser.json());

// secret key  for cookie
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));

// Serve static files from the public directory
const publicDirectoryPath = process.env.PUBLIC_PATH || path.join(__dirname, 'public/assets');
app.use('/assets', express.static(publicDirectoryPath));

// Enable CORS for all routes
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://site-environnement.d2wm.akoatic.ovh"
    ],
    methods: ['GET', 'POST']
}));

// Set view directory
app.set('views', path.join(__dirname, 'views'));
// Set the view engine to Pug
app.set('view engine', 'pug');

// Middleware to generate a nonce and pass it to the response locals
app.use((req, res, next) => {
    // Generate nonce
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

// Helmet middleware for Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://kit.fontawesome.com", (req, res) => res.locals.nonce],
        styleSrc: ["'self'", "fonts.googleapis.com", "https://cdn.jsdelivr.net", (req, res) => res.locals.nonce],
        imgSrc: ["'self'", "http://localhost:3000", "data:"],
        connectSrc: ["'self'", "http://localhost:3000", "ws://localhost:3000"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        // CORP directive 
        crossOriginResourcePolicy: ['same-site']
    },
    reportOnly: true // Set to true to report violations without enforcing the policy
}));

// Object to store connected users
const connectedUserNames = {};

// Routes (define routes after configuring)
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/groups', groupsRouter, verifyCsrfToken);
app.use('/usergroups',  usersGroupsRouter, verifyCsrfToken);
app.use('/count', countRouter, verifyCsrfToken);
app.use('/chatroom', chatRoomsrouter, verifyCsrfToken);
app.use('/messages', userMsgRouter, verifyCsrfToken);
app.use('/posts', postsRouter, verifyCsrfToken);
app.use('/friends', friendsRouter, verifyCsrfToken);
app.use('/datas', FriendsDataRouter);
app.use('/uploads', fileUploadRouter, verifyCsrfToken);
app.use('/events', sendConnectedUsersSSE(connectedUserNames));
app.use('/csrf-token', csrfRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createHttpError(404));
});

// Define error display
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
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
    socket.on('connected_username', (username) => {
        connectedUserNames[username] = username; // Use username as key
        console.log(`Username registered: ${username}`);
    });

    setInterval(() => {
        const filteredUserNames = Object.keys(connectedUserNames);
        socket.emit('connected_user_update', filteredUserNames);
    }, 5000); // Update interval

    socket.on("join_room", (data) => {
        socket.join(data.room);
        // Emit an event to notify the sender that the receiver has joined the chatroom
        io.to(data.senderId).emit("receiver_joined");
    });

    socket.on("send_msg", (data) => {
        socket.to(data.room).emit("received_msg", { message: data.message });
    });
    socket.on('disconnect', (reason) => {
        delete connectedUserNames[socket.id];
        console.log(`User Disconnected (Socket ID: ${socket.id})`);
    });
});

// Define port for Express server
const PORT = process.env.SERVER_PORT || 3000;

// Start the combined server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket server is running on the same port as the HTTP server`);
});
