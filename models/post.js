//here we create a schema for a post 
//we will have attributes : post title,body,photo,postedby

const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema.Types;

const postSchema = mongoose.Schema(
    {
        title : {
            type : String,
            required : true
            //mandatory field
        },
        body : {
            type : String,
            required : true
            //mandatory field
        },
        photo : {
            type : String,
            required : true
            // mandatory  
            //here we store the url of the photo
        },
        likes : [{type : ObjectId , ref : "User"}]
        ,
        comments :[{
            text : {type : String},
            postedBy : {
                type : ObjectId,
                ref : "User"
            }
        }],
        postedby : {
            //here we make a relationship with the user schema

            type : ObjectId,
            ref : "User"

            //postedby attribute refers to user schema
        }
    }
);

mongoose.model("postmodel",postSchema);