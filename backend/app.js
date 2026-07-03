//configuration express
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import { corsOption } from './cors/cors.js';
import { errorHandler } from './middlewares/error.middleware.js';
import helmet from 'helmet';
import {apiLimiter} from './middlewares/rateLimit.middleware.js';

const app = express();
app.use(cors(corsOption));

app.disable("x-powered-by"); //supprime header express
app.use(helmet({ //ajout headers htpp de sécurité
    contentSecurityPolicy: { //Content Security Policy (CSP) pour limiter les sources autorisées et réduire les risques de XSS
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"]
        }
    }
})
);
app.use(express.json({limit: "10kb"})); //permet d'utiliser des données json + protection DOS


app.use("/api", apiLimiter); //limite le nombre de req globale
app.use("/api", userRoutes);
app.use("/api", ticketRoutes);


app.use(errorHandler);

export default app;