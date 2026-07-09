import xss from 'xss';

//évite injection html + xss
export const sanitizeBody = (allowedFields) => {
    return (req, res, next) => {
        if(!req.body || typeof req.body !== "object") return next();

    req.body = Object.fromEntries(Object.entries(req.body) //transforme objet en tableau
        //garde uniquement les champs autorisés
        .filter(([key]) => allowedFields.includes(key)) //récupère seulement la première valeur du tableau
        //nettoie les valeurs texte
        .map(([key, value]) => [key, typeof value === "string" ? xss(value) : value])
        );//puis reconvertit en objet
    next();
    };
};