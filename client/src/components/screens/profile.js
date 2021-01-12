import React ,{useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
const Profile = ()=>{
    const [mypics,setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
    // const [url,setUrl] = useState("");
    // console.log(state);
    useEffect(()=>{
        fetch("/mypost",{
            headers :{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.posts);
        })
    },[]);
    useEffect(()=>{
        if(image)
        {
            const data = new FormData(); //to post a file
            //can be read in mozzila documentation
    
            data.append("file",image);
            data.append("upload_preset","instagram-clone");
            data.append("cloud_name","kulabanta");
    
            fetch("https://api.cloudinary.com/v1_1/kulabanta/image/upload",{
                
                method : "post",
                body : data
            })
            .then(res => res.json())
            .then(data =>{
                // setUrl(data.url);
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}));
                // dispatch({type:"UPDATEPROFILE",payload : data.url});
                fetch("/updatepic",{
                    method : "put",
                    headers:{
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer "+localStorage.getItem("jwt")
                    },
                    body :JSON.stringify({
                        pic : data.url
                    })
                }).then(res=>res.json())
                .then((result)=>{
                    console.log(result);
                    localStorage.setItem("user",JSON.stringify({...state,pic : result.pic}));
                    dispatch({type:"UPDATEPROFILE",payload : result.pic});
                })
            })
            .catch(err =>{
                console.log(err);
            })
    
        }
    },[image])
    const updatePic = (file)=>{
        setImage(file);   
    }
    return(
        <>
        {mypics ?<div style={{maxWidth : "600px", margin : "0px auto"}}>
            <div style ={{
                display:"flex",
                justifyContent :"space-around",
                margin:"18px 0px",
                borderBottom : "1px solid grey"
                }
            }>
            <div>
                <img style={{ width:"160px" , height:"160px",borderRadius:"80px" }} src={state?state.pic:""}/>
                <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                <span>Upload image</span>
                <input 
                    type="file"
                    onChange ={(e)=>updatePic(e.target.files[0])}
                />
                </div>
                {/* <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
                </div> */}
                </div>
            </div>
            <div>
                <h5>{state?state.name:"loading"}</h5>

                <div style ={{
                display:"flex",
                justifyContent :"space-between",
                width:"108%"
                }
            }>
                    <h6>{mypics.length} posts</h6>
                    <h6>{state?state.followers.length:0} followers</h6>
                    <h6>{state?state.following.length:0} following</h6>
                    

                </div>
            </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(pic=>{
                        return(
                            <img key={pic._id} className="item" src={pic.photo} alt={pic.title}/>
                        )
                    })
                }
            </div>
        </div>
        :
        <h2>Loading ...</h2>
         }
        
        </>
    );
} 

export default Profile;