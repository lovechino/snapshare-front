import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link} from "react-router-dom";
import avatarDefault from "../assets/img_avatar.png"
import axios from "axios";
import { setSuggestUsers } from "../Redux/authSlice";

const token = localStorage.getItem("Token")
export const SuggestUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch()
 
  const handleFollow = async (id)=>{
     const response = await axios.post(`https://snapshare-back-2.onrender.com/api/user/florunfl/${id}`,{},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials : true
      }
     )
     if(response.status == 200){
      // console.log(response.data)
        const updateData = suggestedUsers?.filter(user=>user._id !== id)
        dispatch(setSuggestUsers(updateData))
     }
  }
  return (
    <div className=" my-10">
      <div className=" flex items-center justify-between text-sm">
        <div className=" font-semibold text-gray-600">Suggested</div>
        <span className=" font-medium cursor-pointer pl-2">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div key={user._id} className=" flex items-center justify-between">
            <div className=" flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar src={user?.profilePicture || avatarDefault} alt="haha"/>
              </Link>
              <div className=" flex flex-col  gap-1">
                <span>{user?.username}</span>
                <span className=" text-gray-600 text-sm">
                  {user?.bio || "bio"}
                </span>
              </div>
            </div>
            <span onClick={()=>handleFollow(user._id)} className=" font-normal text-blue-400 hover:cursor-pointer">Follow</span>
          </div>
        );
      })}
    </div>
  );
};
