
import React, { useState,useContext, } from 'react';
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../../App"
import M from "materialize-css";

const Login = ()=>{
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    function validateEmail(elementValue){      
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(elementValue); 
      } 

    const PostData = ()=>{
        
        if(!validateEmail(email))
        {
            M.toast({html: "invalid email",classes : "#d32f2f red darken-2"});
            return ;
        }
        fetch("/signin",{
            method : "post",
            headers:{
                "Content-Type" : "application/json",
            }, 
            body : JSON.stringify({
                email,password
            })
        }).then(res=>res.json())
        .then(data =>{
            // console.log(data);
            if(data.error)
                M.toast({html : data.error,classes:"#d32f2f red darken-2" });
            else
            {
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                // go to reducer
                M.toast({html : "signed in successfully",classes : "#00e676 green accent-3"});
                history.push("/");//navigate  to home page
            }
            })
        .catch(err=>{
            console.log(err); 
        })
           
    }
    return(

        <div className = "mycard">
            <div className="card auth-card input-field">
                <h2 className ="brand-logo">INSTAGRAM</h2>
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
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" onClick={()=>PostData()}>
                    Log in
                </button>
                <h6><Link to="/signup">Create an account</Link></h6>
        
            </div>
        </div>
    );
}
 
export default Login;