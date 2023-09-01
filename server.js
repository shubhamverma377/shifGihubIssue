import http from 'http';
import express from 'express';
import 'dotenv/config';
import router from './routes';
import { getCommentFromIssue } from './mapping/commentMapping';

const app = express();
const PORT = process.env.PORT || 9856;

app.use('/', router);

const httpServer = http.createServer(app);

httpServer.listen({ port: PORT }, () => {
  console.log(`Git hub project working on port ${PORT}`);
});

// getCommentFromIssue();
