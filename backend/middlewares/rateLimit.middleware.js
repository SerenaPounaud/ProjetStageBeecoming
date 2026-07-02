import rateLimit from 'express-rate-limit';

//Limite le nombre de requêtes globale api (brute force, spam API)
export const apiLimiter = rateLimit({
    windowMs: 15*60*1000, //15min
    max: 100, //limite à 100 req

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: "Trop de requêtes, veuillez réessayer plus tard"
    }
});

//Limite login
export const loginLimiter = rateLimit({
    windowMs: 10*60*1000, //10min
    max: 5,
    message: "Trop de tentative"
});