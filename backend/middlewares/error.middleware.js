export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.isJoi || err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: err.details?.map(e => e.message)
        });
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Erreur serveur",
    });
};