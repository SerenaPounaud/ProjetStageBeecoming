import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const ticketSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {
        type: String,
        enum: ["ouvert", "en cours", "fermé"],
        default: "ouvert"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true}
    );

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
