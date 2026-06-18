import User from '../models/user.model.js';

//traitement logique des req
export const getHello = (req, res) => {
    res.json({message: "Hello from express"})
}