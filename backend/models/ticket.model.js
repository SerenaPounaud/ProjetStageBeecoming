import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
