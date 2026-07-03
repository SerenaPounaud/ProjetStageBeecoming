export const sanitizeBody = (allowedFields) => {
    return (req, res, next) => {
        if(!req.body || typeof req.body !== "object") return next();

    req.body = Object.fromEntries(
        //transforme un objet en tableau, garde uniquement les champs autorisés
        Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );//puis reconvertit en objet
    next();
    };
};