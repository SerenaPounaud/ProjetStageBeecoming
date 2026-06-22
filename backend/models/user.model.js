import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cgu: { type: Boolean, required: true, default: false }
});

const User = mongoose.model("User", userSchema);
export default User;
