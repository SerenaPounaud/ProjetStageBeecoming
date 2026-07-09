import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connecté")
    } catch (error) {
        console.error("Erreur mongodb", error);
        process.exit(1);
    }
};
export default connectDB;