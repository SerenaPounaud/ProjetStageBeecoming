export const transformTicket = (req,res,next) => {
    if (req.body.title){
        req.body.title = req.body.title.trim();
    }
    if (typeof req.body.status === "string"){
        req.body.status = req.body.status.toLowerCase();
    }
    if (req.body.description){
        req.body.description = req.body.description.trim();
    }

    next();
}