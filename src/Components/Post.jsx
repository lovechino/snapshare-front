import { Avatar } from "antd";
import avatarDefault from "../assets/img_avatar.png"
import {
  Bookmark,
  BookmarkCheck,
  Delete,
  DeleteIcon,
  HeartIcon,
  MessageCircle,
  Recycle,
  RecycleIcon,
  Send,
} from "lucide-react";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setPosts, setSelectedPost } from "../Redux/postSlice";
import CommentView from "./Comment";
import { GetCmtOnePost } from "../UI/Auth/Profile";

export const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch()
  // const {selectedPost} = useSelector(store=>store.post)
  const [textDialog, setTextDialog] = useState("");
  const[liked,setLiked] = useState(post.likes.includes(user._id) || false)
  const[postLike,setPostLike] = useState(post.likes.length)
  const[comment,setComment] = useState(post.comments)
  const setClose = () => {
    setOpen(false);
  };
  const deletePostHandler = async () => {
    const res = await axios.delete(
      `http://localhost:3000/api/post/delete/${post._id}`,
      {
        withCredentials: true,
      }
    );
    if (res.status == 200) {
      const updatePostData = posts.filter((postItem)=>postItem._id !== post._id)
      dispatch(setPosts(updatePostData))
      const sucessNotify = ()=>toast("Delete Successfull")
      sucessNotify()
    }else{
      const error = ()=>toast("Delete Failed")
      error();
    }
  };

  const bookmarkHandler = async()=>{
    const response = await axios.post(`http://localhost:3000/api/post/bookmark/${post._id}`,{},{
      headers :{
        "Content-Type" : "application/json",
      },
      withCredentials:true
    })
    if(response.status == 200){
       console.log(response.data)
    }
  }

  const likeOrDislikeHandler = async ()=>{
    const action = liked ? 'dislike' : 'like'
    const res = await axios.get(`http://localhost:3000/api/post/${action}/${post._id}`,{
      withCredentials : true
    })
    if(res.status == 200){
      const updateLikes = liked ? postLike -1 : postLike + 1
      setPostLike(updateLikes)
      setLiked(!liked)

      const updatePostData = posts.map(p=>p.id === post._id ? {
        ...p,
        likes : liked ? p.likes.filter(id=>id !== user._id) : [...p.likes,user._id]
      } : p)
      dispatch(setPosts(updatePostData))
      console.log(res.data)
    }
  }


  //comment
  const handleaddComment = async()=>{
    const response = await axios.post(`http://localhost:3000/api/post/comment/${post._id}`,{text},{
      headers :{
        'Content-Type' : 'application/json',
      },
      withCredentials : true
    })
    if(response.status == 200){
      const updateCmtPost = [...comment,response.data.comment]
      setComment(updateCmtPost)

      const updatePostData = posts.map(p=>p._id === post._id ?{...p,comments : updateCmtPost} : p )
      dispatch(setPosts(updatePostData))
    }else{
      console.log(response.data)
   
    }
  }

  const handleCmtDialog = async()=>{
    const response = await axios.post(`http://localhost:3000/api/post/comment/${post._id}`,{
       text : textDialog
    },{
      headers :{
        'Content-Type' : 'application/json',
      },
      withCredentials : true
    })
    if(response.status == 200){
      const updateCmtPost = [...comment,response.data.comment]
      setComment(updateCmtPost)

      const updatePostData = posts.map(p=>p._id === post._id ?{...p,comments : updateCmtPost} : p )
      dispatch(setPosts(updatePostData))
    }else{
      console.log(response.data)
    }
  }

  const bookmarkHandle = async()=>{
    const response = await axios.post(`http://localhost:3000/api/post/bookmark/${post?._id}`,{},{
      withCredentials : true
    })
  }
  console.log(user)
  return (
    <div className="my-8 w-full max-w-sm mx-auto max-sm:w-full max-sm:ml-20 max-md:ml-40">
      <div className=" flex justify-between">
       <Link to= {`/profile/${post?.author?._id}`}>
       <div className=" flex items-center gap-2">
          <Avatar size={30} src={post?.author?.profilePicture || avatarDefault} />
          <div className=" flex flex-col">
            <span className=" font-medium">{post.author.username}</span>
            {user && user?._id !== post?.author._id && (
              <span className=" text-blue-400">Follow</span>
            )}
          </div>
        </div>
       </Link>
        {user && user?._id === post?.author._id && (
          <div onClick={deletePostHandler}>
            <Delete />
          </div>
        )}
      </div>
      <img
        className=" rounded-sm my-2 w-full aspect-square object-cover  "
        src={post.image}
        alt="user_post"
      />
      <div className=" flex items-center justify-between my-2">
        <div className=" flex items-center gap-3">
          {liked ? <HeartIcon onClick={likeOrDislikeHandler} color="red" className=" cursor-pointer" /> : <HeartIcon onClick={likeOrDislikeHandler} color="black" className=" cursor-pointer" />}
          <MessageCircle onClick={()=>{
             setOpen(true)
             dispatch(setSelectedPost(post))
          }} className=" cursor-pointer" />
          <Send className=" cursor-pointer" />
          
        </div>
        <Bookmark onClick={bookmarkHandler}/>
        {/* <BookmarkCheck color="green"/> */}
      </div>
      <span className=" font-medium block mb-2">
        {" "}
        {postLike} likes{" "}
      </span>
      <p>
        <span className=" font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <span onClick={() => setOpen(!open)}>View All {comment.length} Comments</span>
      <CommentDialog open={open} setClose={setClose}>
        <div className=" flex flex-1">
          <div className="w-1/2">
            <img
              src={post.image}
              alt="user_post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className=" flex items-center justify-between p-4">
              <div className=" flex gap-3 items-center">
                <Link>
                  <Avatar size={30} src={post?.author?.profilePicture || avatarDefault} />
                </Link>
                <div>
                  <Link className=" font-semibold text-xs">
                    {post.author.username}
                  </Link>
                  {user && user?._id !== post?.author._id && (
                    <span className=" text-gray-600 text-sm">Follow</span>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className=" flex-1 overflow-y-auto max-h-96 p-4">
              {/* {
                comment.map((item)=> <CommentView key={item._id} comment={item}/>)
              } */}
              <GetCmtOnePost postId={post?._id}/>
            </div>
            <div className="p-4">
              <div className=" flex items-center gap-2">
                <input
                  value={textDialog}
                  onChange={(e) => setTextDialog(e.target.value)}
                  type="text"
                  placeholder="add a comment..."
                  className=" w-full outline-none border border-gray-300 p-2 rounded"
                />
                <button
                  disabled={!textDialog.trim()}
                  className=" disabled:text-gray-500"
                  onClick={handleCmtDialog}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </CommentDialog>
      <div className=" flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className=" outline-none text-sm w-full"
        />
        {text && <span onClick={handleaddComment} className="text-amber-300">Post</span>}
      </div>
    </div>
  );
};
