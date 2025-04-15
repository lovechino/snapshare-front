import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import getProfile from "../../hooks/getProfileUser";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Badge, Modal } from "antd";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import CommentDialog from "../../Components/CommentDialog";
import { setAuthUser, setSelecteduser } from "../../Redux/authSlice";
import GetCmtOnePost from "../../Components/GetCmtOnePost";


const token = localStorage.getItem("Token")

function Profile() {
  const params = useParams();
  const navigate = useNavigate()
  const userId = params.id;
  getProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch()
  const { user,selectedUser } = useSelector((store) => store.auth);
  const[isFollowing,setIsFollowing] = useState(user?.following.includes(userId) || false)
  const [tab, setTab] = useState("posts");
  const handleTabChange = (tab) => {
    setTab(tab);
  };
  console.log(isFollowing)
  const displayPost =
    tab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  const [openPost, setOpenPost] = useState(false);
  const setClosePost = () => {
    setOpenPost(false);
  };
  const[value,setValue] = useState()
  console.log(value)
  const[openFollowers,setOpenFlws] = useState(false)
  const setCloseFollowers = () => {
    setOpenFlws(false);
  }
  const[openFollowing,setOpenFlwing] = useState(false)
  const setCloseFollowing = () => {
    setOpenFlwing(false);
  }
  const[textDialog,setTextDialog] = useState("")
  const addCommentHandle = async ()=>{
    if(textDialog.trim()){
       await axios.post(`https://snapshare-back-2.onrender.com/api/post/comment/${value?._id}`,{
        text : textDialog
       },{
        headers:{
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        withCredentials : true
       })
       setTextDialog("")
    }
  }
  const handleKeyDown = (event)=>{
    if(event?.key === 'Enter'){
      addCommentHandle()
    }
  }
  const HandleFollow = async () => {
    const shouldFollow = !isFollowing; // Xác định hành động dựa trên trạng thái hiện tại
  
    try {
      const response = await axios.post(
        `https://snapshare-back-2.onrender.com/api/user/florunfl/${userId}`,
        { action: shouldFollow ? 'follow' : 'unfollow' }, // Gửi hành động đến backend
        {
          headers:{
            Authorization: `Bearer ${token}`
          }, 
          withCredentials: true
        }
      )
  
      if (response.status === 200) {
        setIsFollowing(shouldFollow); // Cập nhật trạng thái sau khi API thành công
        // eslint-disable-next-line no-unsafe-optional-chaining
        let updatedFollowing = [...user?.following];
  
        if (shouldFollow) {
          // Thêm userId nếu đang follow và chưa có trong mảng
          if (!updatedFollowing.includes(userId)) {
            updatedFollowing = [...updatedFollowing, userId];
          }
        } else {
          // Xóa userId nếu đang unfollow
          updatedFollowing = updatedFollowing.filter(id => id !== userId);
        }
  
        // dispatch(setAuthUser({ ...user, following: updatedFollowing })); // Dispatch action để cập nhật Redux
        dispatch(setAuthUser({...user,following : updatedFollowing}))
      } else {
        console.error("Failed to follow/unfollow:", response.data);
        // Xử lý lỗi nếu cần
      }
    } catch (error) {
      console.error("Error during follow/unfollow:", error);
      // Xử lý lỗi nếu cần
    }
  };
  const handleMessageClick = () => {
    dispatch(setSelecteduser(userProfile));
    navigate('/chat');
  };
  console.log(selectedUser)
  return (
    <div className=" flex max-w-4xl justify-center mx-auto pl-10">
      <div className=" flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className=" flex items-center justify-center">
            <Avatar size={100} src={userProfile?.profilePicture} />
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className=" flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {user?._id === userId ? (
                  <Link
                    to="/profile/edit"
                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Edit Profile
                  </Link>
                ) : isFollowing ? (
                  <div>
                    <button onClick={HandleFollow} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                      Unfollow
                    </button>
                    <button onClick={handleMessageClick} className="text-white bg-blue-500 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                      Message
                    </button>
                  </div>
                ) : (
                  <button onClick={HandleFollow} className="text-white bg-blue-500 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Follow
                  </button>
                )}
              </div>
              <div className=" flex items-center gap-4">
                <p>
                  {userProfile?.posts.length}{" "}
                  <span className="font-semibold">posts</span>
                </p>
                <p className="hover:cursor-pointer" onClick={()=>{
                   setOpenFlws(!openFollowers)
                }}>
                  {userProfile?.followers.length}{" "}
                  <span
                    onClick={() => {
                      
                    }}
                    className="font-semibold"
                  >
                    followers
                  </span>
                </p>
                <p className="hover:cursor-pointer" onClick={()=>{
                  setOpenFlwing(!openFollowing)
                }}>
                  {userProfile?.following.length}{" "}
                  <span
                    onClick={() => {
                    
                    }}
                    className="font-semibold"
                  >
                    following
                  </span>
                </p>
                <GetFollowers open={openFollowers} setClose={setCloseFollowers}/>
                <GetFollowing open={openFollowing} setClose={setCloseFollowing}/>
              </div>
              <div>
                <span className="font-semibold">
                  {userProfile?.bio || "No bio"}
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className=" border-t border-t-gray-500">
          <div className=" flex items-center justify-center gap-10 text-sm">
            <span
              className={`"py-3 cursor-pointer ${
                tab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              Post
            </span>
            <span
              className={`"py-3 cursor-pointer ${
                tab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </span>
            
          </div>
          <div className=" grid grid-cols-3 gap-1">
            {displayPost?.map((post) => {
              return (
                <div
                  key={post?._id}
                  className=" relative group cursor-pointer"
                  onClick={() => {setValue(post),setOpenPost(!openPost)}}
                >
                  <img
                    src={post.image}
                    alt="postimage"
                    className=" rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className=" absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className=" flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CommentDialog open={openPost} setClose={setClosePost}>
          <div className=" flex flex-1">
             <div className=" w-1/2">
             <img src= {value?.image} 
              alt="user_post"
              className="w-full h-full object-cover rounded-l-lg"
              />
             </div>
               <div className="w-1/2 flex flex-col justify-between">
            <div className=" flex items-center justify-between p-4">
              <div className=" flex gap-3 items-center">
                <Link>
                  <Avatar size={30} src={userProfile?.profilePicture} />
                </Link>
                <div>
                  <Link className=" font-semibold text-sm">
                    {userProfile?.username}
                    
                  </Link>
                  {user && user?._id !== userProfile?._id && (
                    <span className=" text-gray-600 text-sm">Follow</span>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className=" flex-1 overflow-y-auto max-h-96 p-4">
              <GetCmtOnePost postId={value?._id}/>
            </div>
           
            <div className="p-4">
              <div className=" flex items-center gap-2">
                <input
                value={textDialog}
                onChange={e=>setTextDialog(e.target.value)}
                  type="text"
                  placeholder="add a comment..."
                  className=" w-full outline-none border border-gray-300 p-2 rounded"
                  onKeyDown={handleKeyDown}
                />
                <button
                  disabled = {!textDialog.trim()}
                  className=" disabled:text-gray-500"
                  onClick={addCommentHandle}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
            </div>
          </CommentDialog>
        </div>
      </div>
    </div>
  );
}

const GetFollowers = ({open,setClose})=>{
  const[list,setList] = useState()
  
  const params = useParams();
  const userId = params.id;
  useEffect(()=>{
     const fetchList = async ()=>{
         const data = await axios.post(`http://localhost:3000/api/user/action/${userId}`,{
           action :"followers"
         },{
          headers :{
            "Content-Type" : "application/json",
             Authorization: `Bearer ${token}`
          },
          withCredentials : true
         })
         setList(data?.data?.user?.followers)
     }
     fetchList()
  },[])
  return(
    <Modal open= {open} onOk={setClose} onCancel={setClose}>
       <div>
       <div>List Follower</div>
       {
         list?.map((user)=>{
          return(
            <div>
              <div className=" flex items-center my-2">
               <Avatar size={40} src = {user?.profilePicture || "../assets/img_avatar.png"}/>
               <div>{user?.username}</div>
            </div>
            </div>
          )
         })
        }</div>
    </Modal>
  )
}

const GetFollowing = ({open,setClose})=>{
 
  const[list,setList] = useState()
  const params = useParams();
  const userId = params.id;
  useEffect(()=>{
     const fetchList = async ()=>{
         const data = await axios.post(`http://localhost:3000/api/user/action/${userId}`,{
           action :"following"
         },{
          headers :{
            "Content-Type" : "application/json",
             Authorization: `Bearer ${token}`
          },
          withCredentials : true
         })
         setList(data?.data?.user?.following)
     }
     fetchList()
  },[])
  return(
    <Modal open= {open} onOk={setClose} onCancel={setClose}>
       <div>
       <span className=" font-medium">List Following</span>
        {
         list?.map((user)=>{
          return(
            <div>
              <div className=" flex items-center my-2">
              <Avatar size={40} src = {user?.profilePicture}/>
              <div>{user?.username}</div>
            </div>
            </div>
          )
         })
        }</div>
    </Modal>
  )
}


export default Profile;
