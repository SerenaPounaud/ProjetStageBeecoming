import cors from 'cors';

export const corsOption = {
    origin: "http://localhost:4200",
    method: ["GET", "POST", "PUT", "DELETE"],
    credential:true, //autorise à envoyer des cookies, header autho, auth http
}

export const corsMiddleware = cors(corsOption);