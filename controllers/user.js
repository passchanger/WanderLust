const User = require("../models/user.js");

module.exports.renderSignUpForm =  (req, res) =>{
    res.render("./users/new.ejs");
};

module.exports.signUp = async (req, res)=>{
    try{
    let { username, email, password } = req.body;
    const newUser = new User({email, username});
    const registerUser =  await User.register(newUser,password);
    console.log(registerUser);
    req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listings")
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/listings")
    }
};

module.exports.renderLoginForm =  (req,res)=>{
    res.render("./users/login.ejs")
};
module.exports.login = async (req,res) => {
req.flash("success", "Welocome Back to WanderLust!");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
};

module.exports.logOut =  (req, res, next)=>{
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You are Logout!");
        return res.redirect("/listings")
    });
};