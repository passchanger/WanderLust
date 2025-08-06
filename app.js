const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MajorProject/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/" , (req, res) => {
    res.send("Hi !");
});

//Index Route
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs",{allListings});
});

//Show Route
app.get("/listing/:id", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});

});

//New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs")
})

//Create Route
app.post("/listings", async(req, res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//edit Route

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

//update route

app.put("/listings/:id", async(req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    res.redirect(`/listing/${id}`);
})

//Delete Route

app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
// app.get("/testListing", async (req, res) =>{
//     let sampleListing  = new Listing({
//         title: "my new villa",
//         description: "new ",
//         price: 1200000,
//         location: "Ghaziabad",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("successfull testing")
// });

app.listen(8085 , () => {
    console.log("server is listening");
});
