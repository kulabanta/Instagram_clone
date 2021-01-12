const express = require("express");
const app = express();

//middleware function is called before any hhtp request is executed
//it is a function which accepts the request and modifies it before it reaches to the route handler
function middleware_function(req,res,next){

    console.log("This is a middle ware function");
    next();//this function is used to jump control to the next middleware or http request function
}

app.use(middleware_function);//this is used to use the middleware function

app.get("/",function(req,res){
    console.log("\nget request is processed");
    res.send("Here we are testing middle ware function");
});

//to execute middleware function for a specific route handler ,pass it as a parameter
function specific_middleware(req,res,next)
{
    console.log("this is a specific middleware for about us page");
    next();
} 

app.get("/about",specific_middleware,function(req,res){
    res.send("about page");
});

app.listen(3000,function(){
    console.log("server is running");
});