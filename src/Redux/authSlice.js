import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        user: null,
        suggestedUsers :[],
        userProfile : null,
        selectedUser : null,
        mutualUser :[]
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user = action.payload;
        },
        setSuggestUsers:(state,action)=>{
            state.suggestedUsers = action.payload
        },
        setUserProfile:(state,action)=>{
            state.userProfile = action.payload
        },
        setSelecteduser:(state,action)=>{
            state.selectedUser = action.payload
        },
        setMutualUser:(state,action)=>{
            state.mutualUser = action.payload
        }
    }
})


export const {setAuthUser,setSuggestUsers,setUserProfile,setSelecteduser,setMutualUser} = authSlice.actions
export default authSlice.reducer