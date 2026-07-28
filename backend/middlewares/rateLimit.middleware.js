import rateLimit from 'express-rate-limit';

//Limite le nombre de requêtes globale api (brute force, spam API)
export const apiLimiter = rateLimit({
    windowMs: 15*60*1000, //15min
    max: 1000, //limite à 100 req

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: "Trop de requêtes, veuillez réessayer plus tard"
    }
});

//Limite login
export const loginLimiter = rateLimit({
    windowMs: 15*60*1000, //15min
    max: 500,
    message: "Trop de tentative de connexion"
});