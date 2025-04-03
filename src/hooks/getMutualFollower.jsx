import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {setMutualUser} from "../Redux/authSlice"

const getMutualUser = ()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const{user} = useSelector(store=>store.auth)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        const fetchProfile = async ()=>{
            const response = await axios.get(`http://localhost:3000/api/user/mutual`,{
                withCredentials : true
            })
            if(response.status == 200){
                dispatch(setMutualUser(response.data.mutual))
            }
        }
        fetchProfile()
    },[dispatch])
}

export default getMutualUser