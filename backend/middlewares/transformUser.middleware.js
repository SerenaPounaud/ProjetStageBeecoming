export const transformUser = (req,res,next) => {
    if (!req.body){
        return res.status(400).json({message: "Body manquant"});
    }
    if (req.body.name){
        req.body.name = req.body.name.trim();
    }
    if (req.body.firstname){
        req.body.firstname = req.body.firstname.trim();
    }
    if (req.body.email){
        req.body.email = req.body.email.trim().toLowerCase();
    }
    if (req.body.password){
        req.body.password = req.body.password.trim();
    }

    next();
}