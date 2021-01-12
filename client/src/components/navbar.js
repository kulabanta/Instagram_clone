import React,{useContext} from "react";
//prevent from refreshing the page we use link tag in react js instead of anchor tag
import {UserContext} from "../App";
import {Link,useHistory} from "react-router-dom";

const NavBar = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const renderList = ()=>{
      if(state )
      {
        return [<li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">create post</Link></li>,
        <li><Link to="/myfolposts">posts</Link></li>,
        <li>
          <button className="btn waves-effect waves-light #e53935 red darken-1" 
          onClick={()=>{
                      localStorage.clear();//localStorage will be cleared 
                      dispatch({type:"CLEAR"});
                      history.push("/login");
                  }}>
                    Log Out
          </button>
        </li>
        ]
      }
      else
      {
        return [
          <li><Link to="/login">Log in</Link></li>,
          <li><Link to="/signup">Sign up</Link></li>
        ]
      }
    }
    return(
        <nav>
        <div className="nav-wrapper navbar" >
          <Link to={state?"/":"/login"} className="brand-logo left">INSTAGRAM</Link>
          <ul id="nav-mobile" className="right">
            
            {renderList()}

          </ul>
        </div>
      </nav>
    )
}

export default NavBar;