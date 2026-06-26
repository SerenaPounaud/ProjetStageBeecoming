import Joi from 'joi';

export const validateUser = (req, res, next) => {
    const Schema = Joi.object({
        name: Joi.string().empty('').min(3).max(20).required().messages({
                "string.base": "Le nom doit être une chaîne de caractère",
                "string.empty": "Le nom est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 20 caractères",
                "any.required": "Le nom est obligatoire"
            }),
        firstname: Joi.string().empty('').min(3).max(20).required().messages({
                "string.base": "Le prénom doit être une chaîne de caractère",
                "string.empty": "Le prénom est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 20 caractères",
                "any.required": "Le prénom est obligatoire"
            }),

        email: Joi.string().empty('').required().messages({
                "string.base": "La email doit être une chaîne de caractère",
                "string.empty": "La email est obligatoire",
                "any.required": "La email est obligatoire"
            }),
        password: Joi.string().empty('').min(3).max(10).required().messages({
                "string.base": "Le mot de passe doit être une chaîne de caractère",
                "string.empty": "Le mot de passe est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 10 caractères",
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