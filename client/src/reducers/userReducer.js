//initial state of user
export const initialState = null ;

//reducer function

export const reducer = (state,action) =>{

    if(action.type == "USER")
    {
        return action.payload;
    }
    if(action.type=="CLEAR")
        return null;
    if(action.type == "UPDATEPROFILE")
    {
        return{
            ...state,
            pic : action.payload
            
        }
    }
    if(action.type == "UPDATE")
    {
        return {
            ...state,//spread the previous state
            followers : action.payload.followers,
            following : action.payload.following
            
        }
    }
    return state;

} 