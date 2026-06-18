import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cgu: Boolean
});

const User = mongoose.model("User", userSchema);
export default User;
