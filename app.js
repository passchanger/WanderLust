if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const review = require("./routes/reviews.js");
const UserRouter = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");

const dburl = process.env.ATLASDB_URL;
mongoose.connect(dburl)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("DB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("MongoStore Error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", UserRouter);

app.all("*", (req,res,next) => next(new ExpressError(404, "Page Not Found!")));

app.use((err,req,res,next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
