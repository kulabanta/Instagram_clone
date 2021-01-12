const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const {secretKey} = require("../config/keys.js");
const user = mongoose.model("User");

module.exports = (req,res,next)=>
{
    const {authorization} = req.headers;//check for  authorization in the header

    if(!authorization)//if authorization is not present
    {
        return res.status(401).json({error : "not authorized "});
        //status = 401 means unauthorized
    }
        const token = authorization.replace("Bearer ","");//replace the bearer string from authorization

        //verify the token


        jwt.verify(token,secretKey,(err,payload)=>{

            if(err)
                return res.status(401).json({error : "you must log in"});

            const {_id} = payload;

            
            // console.log(_id);
            

                

            //search for the user by id and if found,save the user data in req.user 
            //we can access the user data from req.user
            user.findById(_id).then((userData)=>{
                // console.log(userData);
                req.user = userData;
                next();//jump to the next middleware or code if the req.user is avilable
            });
            
        });

        
}