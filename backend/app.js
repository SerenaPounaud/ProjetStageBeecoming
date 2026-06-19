//configuration express
import express from 'express';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';

const app = express();

app.use(express.json()); //permet d'utiliser des données json

app.use("/api", userRoutes);
app.use("/api", ticketRoutes);

export default app;