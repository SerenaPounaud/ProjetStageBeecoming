import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const ticketSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "ouvert"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
