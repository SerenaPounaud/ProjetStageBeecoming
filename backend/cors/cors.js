import cors from 'cors';

export const corsOption = {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, //autorise à envoyer des cookies, header autho, auth http
}

export const corsMiddleware = cors(corsOption);