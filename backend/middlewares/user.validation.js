import Joi from 'joi';

export const validateUser = (req, res, next) => {
    const Schema = Joi.object({ //autorise lettres, accents, espaces et tirets
        name: Joi.string().min(3).max(20).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).required().messages({
                "string.base": "Le nom doit être une chaîne de caractère",
                "string.empty": "Le nom est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 20 caractères",
                "string.pattern.base": "Le nom contient des caractères non autorisés",
                "any.required": "Le nom est obligatoire"
            }),
        firstname: Joi.string().min(3).max(20).pattern(/^[a-zA-ZÀ-ÿ\s-]+$/).required().messages({
                "string.base": "Le prénom doit être une chaîne de caractère",
                "string.empty": "Le prénom est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 20 caractères",
                "string.pattern.base": "Le prénom contient des caractères non autorisés",
                "any.required": "Le prénom est obligatoire"
            }),

        email: Joi.string().email({tlds: {allow: true}}).required().messages({ //extension de domaine
                "string.base": "La email doit être une chaîne de caractère",
                "string.empty": "La email est obligatoire",
                "any.required": "La email est obligatoire"
            }),
        password: Joi.string().min(6).max(10).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
                "string.base": "Le mot de passe doit être une chaîne de caractère",
                "string.empty": "Le mot de passe est obligatoire",
                "string.min": "Minimum 6 caractères",
                "string.max": "Maximum 10 caractères",
                "string.pattern.base": "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
                "any.required": "Le mot de passe est obligatoire"
            }),
        cgu: Joi.boolean().valid(true).required().messages({
                "any.only": "Vous devez accepter les CGU",
                "any.required": "L'acceptation des CGU est obligatoire",
                "boolean.base": "La valeur des CGU doit être un booléen"
            })
    });
    //Vérifie si le body respecte le schema + montre toutes les erreurs
    const {error} = Schema.validate(req.body, {abortEarly: false});

    if (error){
        return res.status(400).json({
            message: "Erreur de validation",
            errors: error.details.map(err => err.message)
    });
    }
    next();
};