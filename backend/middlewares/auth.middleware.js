import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization; //récupère l'en-tête http Bearer + token

    if(!authHeader) return res.status(403).json({message: "Token requis"});

    const token = authHeader.split(" ")[1]; //retourne uniquement le token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //vérifie s'il est valide
        console.log(decoded);
        req.userId = decoded.userId; //ajoute l'id user à la requête
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({message: "Token invalide"});
    }
};