import { createSlice } from "@reduxjs/toolkit";


const messNoti = createSlice({
    name: 'messNoti',
    initialState: {
        messNoti: []
    },
    reducers : {
        setMessNoti(state, action) {
            state.messNoti.push(action.payload)
        },
        setReadMess(state,action){
            state.messNoti = action.payload
        }
    }
})

export const {setMessNoti,setReadMess} = messNoti.actions
export default messNoti.reducer