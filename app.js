const express = require("express");
const app = express();//creating a express object

const mongoose = require("mongoose");
const {mongoURI} = require("./config/keys.js");

const port = process.env.PORT || 5000;
//dynamically allocate port


//connecting the database
mongoose.connect(mongoURI, 
    {useNewUrlParser: true,
    useUnifiedTopology : true});//connect to the mongo db database

mongoose.connection.on("connected",()=>{
    console.log("connected to the mongo db database");
});//if connected to the database

mongoose.connection.on("error",(err)=>{
    console.log("error in connecting " + err);
});//if there is an error in connecting


//User schema
require("./models/user.js");
require("./models/post.js");
//we can use the users schema by mongoose.model("Users")

app.use(express.json());//parse the json file .It is a middleware function 

//registering the routers
app.use(require("./routes/auth.js"));
app.use(require("./routes/post.js"));
app.use(require("./routes/user.js"));
app.get("/",(req,res) =>{

    res.send("app.js file is running");
});

if(process.env.NODE_ENV == "production")//project is deployed
{
    app.use(express.static("client/build"));
    //use all static files in "client/build"
    const path = require("path");
    app.get("*",(req,res)=>{
        //all the request are sent to the index.html file
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    })
}

app.listen(port,()=>
{
    console.log("server is running");
});