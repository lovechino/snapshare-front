import { Avatar } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"

const token = localStorage.getItem("Token")
const GetCmtOnePost = ({postId})=>{
     const[list,setList] = useState()
     useEffect(()=>{
      const fetchList = async ()=>{
          const response = await axios.post(`https://snapshare-back-2.onrender.com/api/post/comment/all/${postId}`,{},{
            headers :{
              "Content-Type" : "application/json",
               Authorization: `Bearer ${token}`,
            },
            withCredentials : true
          })
          setList(response?.data?.comments)
      }
      fetchList()
     },[])
     return(
      <div>{list?.map((comment)=>{
        return(
          <div className=" flex items-center mt-2">
             <Avatar src = {comment?.author?.profilePicture}/>
             <div className=" flex flex-col items-center ml-2 mb-2">
               <span className=" text-gray-500">{comment?.author?.username}</span>
               <span>{comment?.text}</span>
             </div>
          </div>
        )
      })}</div>
     )
  }

  export default GetCmtOnePost