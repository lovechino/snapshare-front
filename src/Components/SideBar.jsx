import { Avatar, Badge } from "antd";
import avatarDefault from "../assets/img_avatar.png"
import {
  BellRing,
  BellRingIcon,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../Redux/authSlice";
import CreateNewPost from "./CreateNewPost";
import { setPosts } from "../Redux/postSlice";
import { Popover } from "antd";
import SearchView from "./SearchDialog";

const SideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.notification);
  const {messNoti} = useSelector((store)=>store.messNoti)
  const [opennew, setNew] = useState(false);
  const[openSearch,setOpenSearch] = useState(false)
  const setCloseSearch = ()=>{
    setOpenSearch(false)
  }
  const dispatch = useDispatch();
  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <Badge count = {messNoti.length}>
        <MessageCircle />
      </Badge>,
      text: "Message",
    },
    {
      icon: <BellRing />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: <Avatar src={user?.profilePicture || avatarDefault} alt="haha" />,
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

  const logOut = async () => {
    dispatch(setAuthUser(null));
    dispatch(setPosts([]));
    navigate("/login");
  };
  const setCloseNew = () => {
    setNew(false);
  };
  const handlerSideBar = (e) => {
    // if (e === "Logout") logOut();
    switch (e) {
      case "Logout":
        logOut();
        break;
      case "Create":
        setNew(!opennew);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Message":
        navigate("/chat");
        break;
      case "Search" :
        setOpenSearch(!openSearch)
        break;
    }
  };
  const content = (
    <div>
      {
        likeNotification.map((nt)=>{
          return (
            <div key={nt?.userId}>
              {/* {nt?.userDetails?.username} like your post */}
              {
                nt?.type === "like" ? (
                  <div className=" flex items-center">
                    <Avatar src = {nt?.userDetails?.profilePicture || avatarDefault}/>
                    <p className=" ml-2 text-gray-500">{nt?.userDetails?.username} <span className=" text-black">like your post</span></p>
                  </div>
                ) : (
                  <div className=" flex items-center">
                    <Avatar src = {nt?.userDetails?.profilePicture || avatarDefault}/>
                    <p className=" ml-2 text-gray-500">{nt?.userDetails?.username} <span className=" text-black">comment your post</span></p>
                  </div>
                )
              }
            </div>
          )
        })
      }
    </div>
  );
  const[openPop,setOpenPop] = useState(false)
  return (
    <div className=" fixed top-0 z-10 left-0 px-4 border-r border-gray-400 w-[16%] h-screen sm:w-[20%] md:w-[12%] lg:w-[16%]">
      <div className="flex flex-col justify-center items-center">
        <h1 className="my-8 pl-3 font-bold text-xl text-center max-sm:text-sm">SnapShare</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return item.text === "Notifications" ? (
              <div
                onClick={() => handlerSideBar(item.text)}
                key={index}
                className=" flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 "
              >
                <Popover content= {content} title = "title" open = {openPop} onOpenChange={()=>setOpenPop(!openPop)}>
                  <Badge count={likeNotification.length}>{item.icon} </Badge>
                  {/* <span>{item.text}</span> */}
                </Popover>
                <span onClick={()=>setOpenPop(!openPop)} className=" max-lg:hidden" >{item.text}</span>
              </div>
            ) : (
              <div
                onClick={() => handlerSideBar(item.text)}
                key={index}
                className=" flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span className=" max-lg:hidden">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreateNewPost open={opennew} setClose={setCloseNew} />
      <SearchView open={openSearch} setClose={setCloseSearch}/>
    </div>
  );
};

export default SideBar;
