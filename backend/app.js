//configuration express
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import { corsOption } from './cors/cors.js';
import { errorHandler } from './middlewares/error.middleware.js';
import mongoSanitize  from 'express-mongo-sanitize';
import helmet from 'helmet';
import {apiLimiter} from './middlewares/rateLimit.middleware.js';

const app = express();
app.use(cors(corsOption));

app.use(express.json()); //permet d'utiliser des données json
app.use(mongoSanitize()); //empêche les injections nosql dans les requêtes
app.use(helmet()); //contre xss/clickjacking/mime sniffing, ajoute header http de sécurité

app.use("/api", apiLimiter); //limite le nombre de req globale
app.use("/api", userRoutes);
app.use("/api", ticketRoutes);


app.use(errorHandler);

export default app;