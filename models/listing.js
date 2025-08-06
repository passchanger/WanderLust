const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listenSchema = new Schema({
    title: { 
        type: String, 
        required:true 
    },
    description: String,
    image: { 
        type: Object, 
        default: "https://images.unsplash.com/photo-1753982687273-188d17127327?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1753982687273-188d17127327?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v 
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listenSchema);
module.exports = Listing;
