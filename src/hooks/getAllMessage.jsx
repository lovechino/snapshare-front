import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../Redux/chatSlice"


const getAllMessage = ()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {selectedUser} = useSelector(store=>store.auth)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const token = localStorage.getItem("Token")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        const fetchMessage = async ()=>{
            try{
                const response = await axios.get(`https://snapshare-back-2.onrender.com/api/message/all/${selectedUser?._id}`,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials : true
                })
                if(response.status == 200){
                    dispatch(setMessages(response.data.messages))
                    // console.log(response.data)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchMessage()
    },[selectedUser,dispatch])
}

export default getAllMessage