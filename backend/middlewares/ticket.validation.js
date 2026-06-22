import Joi from 'joi';

export const validateTicket = (req, res, next) => {
    const Schema = Joi.object({
        title: Joi.string().empty('').min(3).max(50).required().messages({
                "string.base": "Le titre doit être une chaîne de caractère",
                "string.empty": "Le titre est obligatoire",
                "string.min": "Minimum 3 caractères",
                "string.max": "Maximum 50 caractères",
                "any.required": "Le titre est obligatoire"
            }),

        description: Joi.string().empty('').max(1000).required().messages({
                "string.base": "La description doit être une chaîne de caractère",
                "string.empty": "La description est obligatoire",
                "string.max": "Maximum 1000 caractères",
                "any.required": "La description est obligatoire"
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