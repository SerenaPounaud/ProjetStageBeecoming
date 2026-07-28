import { Router } from "express";
import User from "../models/user.model.js";

const router = Router();


router.delete("/reset", async (req,res) => {

    if(process.env.NODE_ENV !== "test"){
        return res.status(403).json({
            message:"Interdit hors environnement test"
        });
    }

    await User.deleteMany({});

    res.json({
        message:"Base test nettoyée"
    });
});


export default router;