import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
})