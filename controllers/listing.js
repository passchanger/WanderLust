const Listing = require("../models/listing.js");

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {
        path : "author",

    }}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you Requested for does not exit!");
         return res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});

};

const axios = require("axios");

module.exports.createListings = async(req, res, next)=>{ 
    let url = req.file.path;
    let filename = req.file.filename;

    // Geocode location
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: req.body.listing.location, // user-entered location
            format: "json",
            limit: 1
        },
         headers: {
        "User-Agent": "WanderlustApp/1.0 (your-email@example.com)" // koi bhi valid email/identifier de do
      }
    });

    const geo = response.data[0]; // take first result

    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image = {url, filename};

    // Save coordinates
    newListing.geometry = {
        type: "Point",
        coordinates: [geo.lon, geo.lat]   // [lng, lat]
    };

    await newListing.save(); 
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings"); 
};


module.exports.editListings = async (req, res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you Requested for does not exit!");
             return res.redirect("/listings")
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    };


module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // If a new image was uploaded
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListings = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!")
    res.redirect("/listings");
};
