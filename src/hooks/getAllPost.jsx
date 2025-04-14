import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPosts } from "../Redux/postSlice"


const getAllPost = ()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch()
    // eslint-disable-next-line react-hooks/rules-of-hooks

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        const fetchPost = async ()=>{
            try{
                const response = await axios.get("https://snapshare-back-2.onrender.com/api/post/all",{
                    withCredentials : true
                })
                if(response.status == 200){
                    dispatch(setPosts(response.data.posts))
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchPost()
    },[])
}

export default getAllPost