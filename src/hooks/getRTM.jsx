import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../Redux/chatSlice"

const getRTM = ()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const{socket} = useSelector(store=>store.socketio)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const{messages} = useSelector(store=>store.chat)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        socket?.on('newMessage',(newMess)=>{
            dispatch(setMessages([...messages,newMess]))
        })
        return()=>{
            socket?.off('newMessage')
        }
    },[messages,setMessages,dispatch])
}

export default getRTM