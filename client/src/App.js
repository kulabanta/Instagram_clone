import React ,{useEffect,createContext,useReducer,useContext} from "react";
//useReducer is an alternative of useState
//we use it for context
import NavBar from './components/navbar';
import "./App.css"; 

import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom";

import Home from './components/screens/home';
import Profile from './components/screens/profile';
import Login from './components/screens/login';
import Signup from './components/screens/signup';
import FollowerPosts from "./components/screens/folUserPost.js";

import Createpost from './components/screens/createPost';
import UserProfile from './components/screens/userProfile';
import {reducer,initialState} from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = ()=>{
    const history = useHistory();

    const {state,dispatch} = useContext(UserContext);
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        //retrieve the user information from localStorage
        // console.log(typeof(user),user))
        if(user)
        {
          //if user exists the go to the home page
          dispatch({type:"USER",payload:user});
          // history.push("/");
        }
        else
        {
            history.push("/login");
        }

    },[]);

    return(
      <Switch>
            <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/signup">
              <Signup/>
          </Route>
          <Route exact path="/profile">
              <Profile/>
          </Route> 
          <Route path="/create">
              <Createpost/>
          </Route>  
          <Route path="/profile/:userid">
              <UserProfile/>
          </Route>  
          <Route path="/myfolposts">
              <FollowerPosts/>
          </Route>  
      </Switch>

    );

}
//we cannot use useHistory inside App beacause it is not wrapped
//inside BrowserRouter 
//so we have created a function name Routing
function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value ={{state,dispatch}}>
      {/* we all have access to state and dispatch in all components
      below this */}
    <BrowserRouter>
        <NavBar />
        <Routing />
    </BrowserRouter>
     </UserContext.Provider>
  );
}

export default App;
