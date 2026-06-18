import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/ticketManagerDB");
        console.log("MongoDB connecté")
    } catch (error) {
        console.error("Erreur mongodb", error);
        process.exit(1);
    }
};
export default connectDB;