export const transformUser = (req,res,next) => {
    if (req.body.name){
        req.body.name = req.body.name.trim();
    }
    if (req.body.email){
        req.body.email = req.body.email.trim();
    }
    if (req.body.password){
        req.body.password = req.body.password.trim();
    }

    next();
}