import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name : "chat",
    initialState : {
        onlineUser :[],
        messages :[]
    },
    reducers : {
        setOnlineUser:(state,action)=>{
            state.onlineUser = action.payload;
        },
        setMessages :(state,action)=>{
            state.messages = action.payload;
        }
    }
})

export const {setOnlineUser,setMessages} = chatSlice.actions
export default chatSlice.reducer; 