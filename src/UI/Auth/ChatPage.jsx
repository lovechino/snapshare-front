import { Avatar, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSelecteduser } from "../../Redux/authSlice";
import { ImagePlus, MessageCircle, Mic, MicIcon, MicVocal, Send } from "lucide-react";
import Messages from "../../Components/Messages";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { setMessages } from "../../Redux/chatSlice";
import {  setReadMess } from "../../Redux/messNoti";

import { readFileAsDataUrl } from "../../Components/CreateNewPost";
import { GiTalk } from "react-icons/gi";


const token = localStorage.getItem("Token")
const ChatPage = () => {
  const { user, selectedUser, mutualUser } = useSelector((store) => store.auth);
  const { messNoti } = useSelector((store) => store.messNoti);
  // const isOnline = true
  const fileInputRef = useRef(null);
  const[file,setFile] = useState("")
  const[preView,setPreview] = useState("")
  const [textMessage, setTextMessage] = useState("");
  const { onlineUser } = useSelector((store) => store.chat);
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  // const[onMic,setOnMic] = useState(false)
  // const [audioBlob, setAudioBlob] = useState(null);
  // const mediaRecorder = useRef(null);
  // const audioChunks = useRef([]);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio : true });
//     mediaRecorder.current = new MediaRecorder(stream);
//     audioChunks.current = [];

//     mediaRecorder.current.ondataavailable = event => {
//         if (event.data.size > 0) {
//             audioChunks.current.push(event.data);
//         }
//     };

//     mediaRecorder.current.onstop = () => {
//         const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
//         setAudioBlob(blob);
//         setOnMic(!onMic)
//         stream.getTracks().forEach(track => track.stop());
//     };

//     setOnMic(!onMic)
//     mediaRecorder.current.start();

// };

// const stopRecording = () => {
//   setOnMic(!onMic)
//   if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
//     mediaRecorder.current.stop();
// }
// };
// const sendAudioToCloudinary = async (receiverId) => {
//     const formData = new FormData();
//     formData.append('audio', audioBlob,{originalname : "test.mp3"});
   
    
//     console.log(audioChunks)
// };



 
  const handleImageIconClick = async (e)=>{
    const selecfile = e.target.files?.[0];
        if (selecfile) {
          setFile(selecfile);
          const dataUrl = await readFileAsDataUrl(selecfile);
          setPreview(dataUrl);
        }
  }
  const sendMessage = async (receiverId) => {
    let payload;
    let headers = {
      withCredentials: true,
    };
  
    if (file) { 
      payload = new FormData();
      payload.append("message", textMessage);
      payload.append("image", file); 
      headers["Content-Type"] = "multipart/form-data";
      headers["Authorization"] = `Bearer ${token}`
    } else {
      payload = { message: textMessage };
      headers["Content-Type"] = "application/json";
      headers["Authorization"] = `Bearer ${token}`
    }
  
    try {
      const response = await axios.post(
        `https://snapshare-back-2.onrender.com/api/message/send/${receiverId}`,
        payload,{
          headers: headers,
          withCredentials : true
        }
      );
  
      if (response.status === 200) {
        dispatch(setMessages([...messages, response.data.newMessage]));
        console.log(response.data);
        setTextMessage("");
        setPreview("");
        setFile(""); 
      } else {
        console.error("Error sending message:", response.status, response.data);
     
      } 
      console.log(response.data.message)
    } catch (error) {
      console.error("Error sending message:", error);
     
    }
    
  };
  const FilterMess = (id) => {
    
    const updateData = messNoti.filter((item)=>item.senderId !== id)
     dispatch(setReadMess(updateData));
  };
  useEffect(() => {
    if (!selectedUser) {
      dispatch(setSelecteduser(null));
    }
    return () => {
    };
  }, [dispatch, selectedUser /* Thêm các dependency khác nếu cần */]);
  return (
    <div className=" flex ml-[16%] h-screen">
      <section className=" w-full md:w-1/4 my-8 max-md:w-1/5 ">
        <h2 className="font-bold mb-4 px-3 text-xl max-md:hidden max-lg:hidden">
          {user?.username}
        </h2>
        <hr className="mb-4 border-gray-300" />
        <div className=" overflow-y-auto h-[80vh]">
          {mutualUser?.map((user) => {
            const isOnline = onlineUser.includes(user?._id);
            const messageFromSender = messNoti.filter(
              (message) => message.senderId === user?._id
            );
            return (
              <div
                onClick={() => {
                    dispatch(setSelecteduser(user)),
                    FilterMess(user?._id)
                }}
                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Avatar
                    src={user?.profilePicture}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {user.username}
                  </span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <Badge count= {messageFromSender.length}></Badge>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className=" flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className=" flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar src={selectedUser?.profilePicture} />
            <div className=" flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages />
          {preView && (
              <div className="w-full flex items-center justify-center">
                <img src= {preView}  alt="aaa" className="object-cover h-[200px] "/>
              </div>
            )}
          <div className=" flex items-center p-4 border-t border-t-gray-300">
          <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageIconClick}
            />
            <button onClick={()=>fileInputRef.current.click()} className="mr-2 text-gray-500 hover:text-blue-500 cursor-pointer">
              <ImagePlus className="w-6 h-6"/>
            </button>

            {/* <button className="mr-2 text-gray-500 hover:text-blue-500 cursor-pointer">
              {
                onMic ? (
                  <Mic onClick={startRecording} className="w-6 h-6"/>
                ) : (
                  <MicVocal color="red" onClick={()=>{
                    stopRecording()
                  }} className="w-6 h-6 "/>
                )
              }
            </button> */}
           <input
      value={textMessage}
      onChange={(e) => setTextMessage(e.target.value)}
      type="text"
      className=" flex-1 mr-2 focus-visible:ring-transparent"
      placeholder="Message..."
    />
    <button
      onClick={() => sendMessage(selectedUser?._id)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold "
    >
      Send
    </button>
          </div>
        </section>
      ) : (
        <div className=" flex flex-col items-center justify-center mx-auto">
          <MessageCircle className=" w-32 h-32 my-4" />
          <span>Send a message</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
