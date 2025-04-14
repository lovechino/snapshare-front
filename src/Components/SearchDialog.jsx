import { Avatar } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import avatarDefault from "../assets/img_avatar.png"

const SearchView = ({ open, setClose }) => {
  const searchRef = useRef(null);
  const handleClickOutSide = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setClose();
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [open, setClose]);
  return (
    <div
      className={` fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        ref={searchRef}
        className={`bg-white rounded-xl shadow p-6 transition-all ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <ResultView />
      </div>
    </div>
  );
};

const ResultView = ()=>{
  const[username,setUsername] = useState("")
  const[list,setList] = useState()
    useEffect(()=>{
        const getResult = async()=>{
           if(username){
            const response = await axios.post("https://snapshare-back-2.onrender.com/api/user/search",{
              username : username
            },{
              headers:{
                "Content-Type": "application/json",
              },
              withCredentials : true
            })
            setList(response.data?.user)
           }
          }
        getResult()
    })
    return(
        <div>
             <input type="search" value={username} onChange={e=>setUsername(e.target.value)} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
             <div>
                {
                  list?.map((item)=>{
                    return(
                      <div className=" mt-5">
                         <Avatar src = {item?.profilePicture || avatarDefault}/>
                         <span>{item.username}</span>
                      </div>
                    )
                  } )
                }
             </div>
        </div>
    )
}

export default SearchView;
