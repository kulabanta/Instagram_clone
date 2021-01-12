import React ,{useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
import {useParams} from "react-router-dom";
const Profile = ()=>{
    const [userProfile,setProfile] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const  {userid} = useParams();
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true);

    // console.log(userid);
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers :{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result);
        })
    },[]);

    const followUser = ()=>{

        fetch("/follow",{
            method : "put",
            headers :{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                followId : userid
            })
        }).then(res =>res.json())
        .then(data =>{
            setShowFollow(false);
            dispatch({type:"UPDATE",payload:{following : data.following,followers : data.followers }});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                return {
                ...prevState,//spread the previous state
                user : {
                    ...prevState.user,//previous state of user
                    followers : [...prevState.user.followers,data._id]
                    //in the followers logged in data id is appended
                    }
                }
            })
        })

    }
    const unfollowUser = ()=>{

        fetch("/unfollow",{
            method : "put",
            headers :{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body :JSON.stringify({
                unfollowId : userid
            })
        }).then(res =>res.json())
        .then(data =>{
            setShowFollow(true);
            dispatch({type:"UPDATE",payload:{following : data.following,followers : data.followers }});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                const newFollowers = prevState.user.followers.filter(item => item !== data._id);
                return {
                
                ...prevState,//spread the previous state
                user : {
                    ...prevState.user,//previous state of user
                    followers : newFollowers
                    //in the followers logged in data id is appended
                    }
                }
            })
        })

    }
    
    return(
        //the fetching will take some time
        //so we put a condition
        <>
        {userProfile?
                <div style={{maxWidth : "600px", margin : "0px auto"}}>
                <div style ={{
                    display:"flex",
                    justifyContent :"space-around",
                    margin:"18px 0px",
                    borderBottom : "1px solid grey"
                    }
                }>
                <div>
                    <img style={{ width:"160px" , height:"160px",borderRadius:"80px" }} src={userProfile?userProfile.user.pic:""}/>
                </div>
                <div>
                    <h5>{userProfile?userProfile.user.name:"loading"}</h5>
                    <h5>{userProfile?userProfile.user.email:"loading"}</h5>

                    <div style ={{
                    display:"flex",
                    justifyContent :"space-between",
                    width:"108%"
                    }
                }>
                        <h6>{userProfile.posts?userProfile.posts.length:0} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>

                        {
                            showFollow == true ?
                            <button className="btn waves-effect waves-light #42a5f5 blue darken-1" 
                            onClick={()=>followUser()}>
                                follow
                            </button>
                            :
                            
                            <button className="btn waves-effect waves-light #42a5f5 blue darken-1" 
                            onClick={()=>unfollowUser()}>
                                unfollow
                            </button>

                        }
                        
                        

                    </div>
                </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(pic=>{
                            return(
                                <img key={pic._id} className="item" src={pic.photo} alt={pic.title}/>
                            )
                        })
                    }
                </div>
            </div>
        :<h2>loading</h2>}
        
        </>
    );
} 

export default Profile;