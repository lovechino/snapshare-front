
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/postSlice";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

export const readFileAsDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};
const token = localStorage.getItem("Token")
const CreateNewPost = ({ open, setClose }) => {
  const imgRef = useRef();
  // const{user} = useSelector(store=>store.auth)
  const dispatch = useDispatch()
  const{posts} = useSelector(store=>store.post)
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const newPostRef = useRef(null);
  const [preView, setPreview] = useState("");
  const handleClickOutside = (e) => {
    if (newPostRef.current && !newPostRef.current.contains(e.target)) {
      setClose();
    }
  };
  const fileChangeHandler = async (e) => {
    const selecfile = e.target.files?.[0];
    if (selecfile) {
      setFile(selecfile);
      const dataUrl = await readFileAsDataUrl(selecfile);
      setPreview(dataUrl);
    }
  };
  // formData.append("img",file)
    //  const res = await axios.post("http://localhost:3000/api/post/addpost",formData,{
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   }
    //  }).catch(err=>console.log(err.data))

    const key = 'updatable';
    const[api,contextHoler] = notification.useNotification()
    const OpenNotification = ()=>{
        setTimeout(()=>{
            api.open({
                key,
                message: 'Login Success',
                description: "Login"
            })
        },1000)
    }

    const FailNotification = ()=>{
      setTimeout(()=>{
          api.open({
              key,
              message: 'Authentication',
              description: "Login Again Please"
          })
      },1000)
  }
  const navigate = useNavigate()
  const createPostHandler = async () => {
    const formData = new FormData()
    formData.append("caption",caption)
    formData.append("img",file)
     const res = await axios.post("https://snapshare-back-2.onrender.com/api/post/addpost",formData,{
      headers: {
        "Content-Type": "multipart/form-data",
         Authorization: `Bearer ${token}`
      }
      ,
      withCredentials : true
     }).catch(err=>{
      if(err.response && err.response.status === 401){
        FailNotification()
        navigate("/login")
      }
     })
    if(res.status == 200){
      dispatch(setPosts([res.data.post,...posts]))
      alert("Post created successfully")
      setCaption("")
      setPreview("")
      setClose()
      OpenNotification()
    }else{
      FailNotification()
    }
    
  }
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setClose]);
  return (
    <div
      className={` fixed inset-0 flex justify-center items-center  transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      {contextHoler}
      <div
        ref={newPostRef}
        className={`bg-white rounded-xl shadow  p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        {/* <button onClick={setClose} className=" absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">X</button> */}
        <div className=" text-center font-semibold">Create New Post</div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption"
          className="w-full"
        />
        {preView && (
          <div className="w-full flex items-center justify-center">
            <img src={preView} alt="aaa" className="object-cover h-[500px] " />
          </div>
        )}
        <input
          ref={imgRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <div className=" flex justify-center items-center my-2">
          <button
            onClick={() => imgRef.current.click()}
            className=" bg-blue-200 px-3 py-3"
          >
            Select from computer
          </button>
        </div>
        <button
          disabled={!caption.trim()}
          className=" disabled:bg-gray-500 disabled:hover:cursor-alias my-2 w-full bg-blue-300 px-3 py-2 hover:cursor-pointer"
          onClick={createPostHandler}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreateNewPost;
