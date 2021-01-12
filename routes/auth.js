//creating the routers

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const User = mongoose.model("User");

const jwt = require("jsonwebtoken");

const {mongoUri,secretKey} = require("../keys.js");

const requirelogin = require("../middleware/requiredlogin.js");


//signup route
router.post("/signup",function(req,res){
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password)
    {
        // res.statusCode=422; we can use this too
        return res.status(422).json({
            error : "please fill all the fields"
        });//send a json respond
        //status = 422 means server has received the request but couldnot processed it
    }
    //number represents the level of security of password
    bcrypt.hash(password,15)
    .then((hashedpassword) =>
    {
        const user = new User({name,email,password:hashedpassword,pic});

        user.save()
        .then((user)=>{
            res.json({message : "User data saved successfully"});
        })
        .catch((err) =>
        {
            console.log(err);
        });

        //here we have used promise function read about it
    });
});

//signin route
router.post("/signin",function(req,res){
    const {email,password} = req.body;

    if(!email || !password)
    {
        return res.status(422).json({error : "please fill both fields"});
    }
    else
    {
        User.findOne({email:email})
        .then((savedUser)=>
        {
            if(!savedUser.email)
            {
                return res.status(422).json({email:"email is not registered"});
            }
            bcrypt.compare(password,savedUser.password)
            .then((match)=>
            {
                if(match)
                {
                    // res.status(200).json({message :"sign in successfully"});
                    const token = jwt.sign({_id : savedUser._id},secretKey);
                    const {_id,name,email,followers,following,pic} = savedUser;
                    res.json({token,user:{_id,name,email,followers,following,pic}});
                }
                else
                {
                    return res.status(422).json({error : "invalid password"});
                }
            })
            .catch((err)=>{
                console.log(err);//server side error
                //error from devloper side
            });
            
        });
    }
});

router.get("/protected",requirelogin,(req,res)=>{
    res.send("hello");
});


module.exports = router;