import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {setUserProfile } from "../Redux/authSlice"


const getProfile = (userId)=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const token = localStorage.getItem("Token")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        const fetchProfile = async ()=>{
            const response = await axios.get(`https://snapshare-back-2.onrender.com/api/user/profile/${userId}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                },
                withCredentials : true
            })
            if(response.status == 200){
                dispatch(setUserProfile(response.data.getUser ))
            }
        }
        fetchProfile()
    },[userId])
}

export default getProfile