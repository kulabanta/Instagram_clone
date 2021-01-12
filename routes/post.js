const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const requiredlogin = require("../middleware/requiredlogin.js");

const post = mongoose.model("postmodel");

//fetching all thhe posts

router.get("/allposts",requiredlogin,(req,res)=>
{
    //find all posts
    post.find()
    .populate("postedby","_id name")//populate the postedby column with onlu _id and name column
    .populate("comments.postedBy","_id name")
    .then((posts)=>
    {
        res.json({posts});
    }).catch(err=>
    {
        console.log(err);
    });

});
router.get("/getfolposts",requiredlogin,(req,res)=>
{
    //find all posts
    //if postedby in user.following array
    post.find({postedby : {$in : req.user.following}})
    .populate("postedby","_id name")//populate the postedby column with onlu _id and name column
    .populate("comments.postedBy","_id name")
    .then((posts)=>
    {
        res.json({posts});
    }).catch(err=>
    {
        console.log(err);
    });

});


//creating a post
router.post("/createpost",requiredlogin,(req,res) =>
{
    const {title,body,url} = req.body; //obtaining the title and body from request

    // console.log(req.body);
    if(!title || !body || !url)
    {
       return res.status(422).json({error : "please fill all the fields "});
    }

    // console.log(req.user);
    // res.send("hello");

    // req.user.password = undefined;//not storing the password
    const Post = new post({
        title ,//title : title as both are same we can condense
        body,
        photo : url,
        postedby : req.user//user details 
    });

    // console.log(Post);

    Post.save().then(result => {
        res.json({post : result});
    }).catch(error =>{
        console.log(error);
    })//save the post schema in mongodb database
});

router.get("/mypost",requiredlogin,(req,res)=>{

    post.find({postedby : req.user._id })//get all the post created by the user
    .populate("postedby","_id name")//populate the postedby column
    .then(posts =>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    });
});

//put is used for update
router.put("/like",requiredlogin,(req,res)=>
{
    post.findByIdAndUpdate(req.body.postId,{//postId is the id of post
        $push:{likes : req.user._id}//user who is likng the post
    },{
        new : true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error : err});
        }
        else
        {
            return res.json(result);
        }
    })
    //find the post by its id and then update  the likes by pushing the id 
    //of the user that likes the post
});
router.put("/unlike",requiredlogin,(req,res)=>
{
    post.findByIdAndUpdate(req.body.postId,{//postId is the id of post
        $pull:{likes : req.user._id}//user who is likng the post
    },{
        new : true
    }).exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error : err});
        }
        else
        {
            return res.json(result);
        }
    })
    //find the post by its id and then update  the likes by pushing the id 
    //of the user that likes the post
});

router.put("/comment",requiredlogin,(req,res)=>
{
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    post.findByIdAndUpdate(req.body.postId,{//postId is the id of post
        $push:{comments : comment}//user who is likng the post
    },{
        new : true
    }).populate("comments.postedBy","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err)
        {
            return res.status(422).json({error : err});
        }
        else
        {
            return res.json(result);
        }
    })
    //find the post by its id and then update  the likes by pushing the id 
    //of the user that likes the post
});

router.delete("/deletepost/:postId",requiredlogin,(req,res)=>{

    post.findOne({_id : req.params.postId})
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err || !post)
        {
            return res.status(422).json({error : err});
        }
        if(post.postedby._id.toString() === req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                return res.json(result);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    });
})

router.delete("/deletecomment/:postid&:commentid",requiredlogin,(req,res)=>{

    
})




module.exports = router;