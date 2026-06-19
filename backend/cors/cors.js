import cors from 'cors';

export const corsOption = {
    origin: "http://localhost:4200",
    method: ["GET", "POST", "PUT", "DELETE"],
    credential:true,
}

export const corsMiddleware = cors(corsOption);