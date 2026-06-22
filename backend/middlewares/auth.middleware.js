import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //récupère l'en-tête http

    if(!authHeader) return res.status(403).json({message: "Token requis"});

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; //ajoute l'id user à la requête
        next();
    } catch (error) {
        return res.status(401).json({message: "Token invalide"});
    }
};