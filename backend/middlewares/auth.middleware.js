import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    
    const token = req.cookies?.token; //récupère le token dans les cookies

    if(!token) return res.status(403).json({message: "Token requis"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //vérifie s'il est valide
        req.userId = decoded.userId; //ajoute l'id user à la requête
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({message: "Token invalide"});
    }
};