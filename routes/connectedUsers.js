import { Router } from 'express';

const router = Router();

// SSE Route (Server Sent Events)
export const sendConnectedUsersSSE = (connectedUserNames) => {
    return router.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvent = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Send initial connected users data
        sendEvent(Object.keys(connectedUserNames));

        // Interval to send connected users data every 5 seconds
        const intervalName = setInterval(() => {
            sendEvent(Object.keys(connectedUserNames));
        }, 5000);

        // Cleanup on client disconnect
        req.on('close', () => {
            clearInterval(intervalName);
        });
    });
};

export default router;
