import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(express.json());

// Base Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

export default app;