import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbURL = process.env.NODE_ENV === "test"
        ? process.env.DB_URL_TEST
        : process.env.DB_URL;
        await mongoose.connect(dbURL);
        /*
        await mongoose.connect(process.env.DB_URL);*/
        console.log("MongoDB connecté")
    } catch (error) {
        console.error("Erreur mongodb", error);
        process.exit(1);
    }
};
export default connectDB;