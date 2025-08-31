const { ref } = require("joi");
const mongoose = require("mongoose");
const { listingSchema } = require("../Schema");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listenSchema = new Schema({
    title: { 
        type: String, 
        required:true 
    },
    description: String,
    image: { 
        url : String,
        filename : String
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"], 
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
         type : Schema.Types.ObjectId,
         ref : "User"
    },
    
});

listenSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews }});
    }
})

const Listing = mongoose.model("Listing", listenSchema);
module.exports = Listing;
