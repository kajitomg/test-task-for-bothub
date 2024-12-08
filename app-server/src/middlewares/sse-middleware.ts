import { RequestHandler } from 'express';

const sseMiddleware: RequestHandler = (req, res, next) => {
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  if (req.httpVersion !== '2.0') {
    res.setHeader('Connection', 'keep-alive');
  }
  res.flushHeaders()
  
  next()
}

export default sseMiddleware;