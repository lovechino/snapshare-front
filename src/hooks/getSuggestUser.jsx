import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSuggestUsers } from "../Redux/authSlice"

const getSuggestUser = ()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        const fetchSuggestUser = async ()=>{
            const response = await axios.get('http://localhost:3000/api/user/suggested',{
                withCredentials : true
            })
            if(response.status == 200){
                dispatch(setSuggestUsers(response.data.users))
            }
        }
        fetchSuggestUser()
    },[])
}

export default getSuggestUser