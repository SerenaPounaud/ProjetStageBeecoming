import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//traitement logique des req

export const signup = async (req,res,next) => {
    try {
        const {name, email, password, cgu} = req.body;

        const existingUser = await User.findOne({email:email});
        if (existingUser) return res.status(400).json({message: "Email déjà utilisé"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            cgu
        });

        await user.save();
        res.status(200).json({message: "Utilisateur ajouté", user});
    } catch (error) {
        next(error);
    }
};

export const signin = async (req,res,next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email:email});
        if (!user) return res.status(404).json({message: "Email ou mot de passe incorect"});

        const isMatch = await User.findOne({password:user.password});
        if (!isMatch) return res.status(404).json({message: "Email ou mot de passe incorect"});

        const token = jwt.sign(
         {userId: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        res.status(201).json({token});
    } catch (error) {
        next(error);
    }
};