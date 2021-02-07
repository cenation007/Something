const initState = {
    user: null,
    userList: []
}

const userReducer = (state = initState,action) => {
    if(action.type == "user") {
        return {...state, user: action.payload}
    } 
    if(action.type == "logout")
        return {...state, user: null};
    if(action.type == "SEARCH_USERS")
        return {...state,userList: action.payload}
    if(action.type == "UPDATE_FOLLOWERS"){ 
        return {...state,user: action.payload}
    }
    return state;
    
}

export default userReducer