//configuration express
import express from 'express';
import userRoutes from './routes/user.routes.js'

const app = express()

app.use("/api", userRoutes);

export default app;