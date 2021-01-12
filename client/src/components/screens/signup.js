import React, { useState,useEffect } from 'react'
import {Link,useHistory} from "react-router-dom"
import M from "materialize-css"



const Signup = ()=>{
        const history = useHistory();
        const [name,setName] = useState("");
        const [email,setEmail] = useState("");
        const [password,setPassword] = useState("");
        const [image,setImage] = useState();
        const [url,setUrl] = useState(undefined);
        //if pic is undefined then default pic will be used
        useEffect(()=>{
            if(url)
            {
                uploadFields();
            }
        },[url])
        const uploadPic = () =>{
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
                setUrl(data.url);
            })
            .catch(err =>{
                console.log(err);
            })
    
        }
        function validateEmail(elementValue){      
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(elementValue); 
          } 
        const uploadFields = ()=>{
            if(!validateEmail(email))
            {
                M.toast({html: "invalid email",classes : "#d32f2f red darken-2"});
                return ;
            }
            fetch("/signup",{
                method : "post",
                headers:{
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    name,email,password,pic:url
                })
            }).then(res=>res.json())
            .then(data =>{
                if(data.error)
                    M.toast({html : data.error,classes:"#d32f2f red darken-2" });
                else
                {
                    M.toast({html : data.message,classes : "#00e676 green accent-3"});
                    history.push("/login");//navigate  to login page
                }
                })
            .catch(err=>{
                console.log(err); 
            })
               
        }
        

        
        const postData = ()=>{

            if(image)
                uploadPic();
            else
                uploadFields();
        }

    return(
        
        <div className = "mycard">
            <div className="card auth-card input-field">
                <h2 className ="brand-logo">INSTAGRAM</h2>
                <input  
                    type="text"
                    placeholder="Username"
                    value =  {name}
                    onChange={(e)=>{
                        setName(e.target.value);
                    }}
                />
                <input  
                    type="text"
                    placeholder="email"
                    value =  {email}
                    onChange={(e)=>{
                        setEmail(e.target.value);
                    }}
                />
                <input 
                    type="password"
                    placeholder="password"
                    value =  {password}
                    onChange={(e)=>{
                        setPassword(e.target.value);
                    }}
                />
                <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                <span>Upload image</span>
                <input 
                    type="file"
                    onChange ={(e)=>setImage(e.target.files[0])}
                />
                </div>
                <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
                </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                onClick ={()=>postData()}
                >
                    Sign up
                </button>
                <h6><Link to="/login">Already registered ? sign in</Link></h6>
        
            </div>
        </div>
    );
}
 
export default Signup;