import { Avatar } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { setSelecteduser } from "../../Redux/authSlice"
import { MessageCircle } from "lucide-react"
import Messages from "../../Components/Messages"
import { useEffect, useState } from "react"
import axios from "axios"
import { setMessages } from "../../Redux/chatSlice"

const ChatPage = ()=>{
    const{user,suggestedUsers,selectedUser, mutualUser} = useSelector(store=>store.auth)
    // const isOnline = true
    const[textMessage,setTextMessage] = useState("")
    const {onlineUser} = useSelector(store=>store.chat)
    const {messages} = useSelector(store=>store.chat)
    const dispatch = useDispatch()
    // console.log(onlineUser)
    console.log(messages)

    const sendMessage = async (receiverId)=>{
        const response = await axios.post(`http://localhost:3000/api/message/send/${receiverId}`,{
            message:textMessage
        },{
            headers:{
                "Content-Type": "application/json"
            },
            withCredentials:true
        })
        if(response.status == 200){
            dispatch(setMessages([...messages,response.data.newMessage]))
            console.log(response.data)
            setTextMessage("")
        }
    }
    useEffect(()=>{
        dispatch(setSelecteduser(null))
    },[])
    return(
        <div className=" flex ml-[16%] h-screen">
            <section className=" w-full md:w-1/4 my-8 max-md:w-1/5 ">
                <h2 className="font-bold mb-4 px-3 text-xl max-md:hidden max-lg:hidden">{user?.username}</h2>
                <hr className="mb-4 border-gray-300"/>
                <div className=" overflow-y-auto h-[80vh]">
                    {
                        mutualUser?.map((user)=>{
                            const isOnline = onlineUser.includes(user?._id)
                            return(
                                <div onClick={()=>dispatch(setSelecteduser(user))} className=" flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer">
                                    <Avatar src = {user?.profilePicture}/>
                                    <div className=" flex flex-col">
                                        <span className="font-medium">{user.username}</span>
                                        <span className= {`text-xs ${isOnline ? 'text-green-600' : ""}`}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser ? (
                    <section className=" flex-1 border-l border-l-gray-300 flex flex-col h-full">
                        <div className=" flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                            <Avatar src = {selectedUser?.profilePicture}/>
                            <div className=" flex flex-col">
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages />
                            <div className=" flex items-center p-4 border-t border-t-gray-300">
                                <input value={textMessage} onChange={e=>setTextMessage(e.target.value)} type="text" className=" flex-1 mr-2 focus-visible:ring-transparent" placeholder="Message..."/>
                                <button onClick={()=>sendMessage(selectedUser?._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold ">Send</button>
                            </div>
                    </section>
                ) : (<div className=" flex flex-col items-center justify-center mx-auto">
                    <MessageCircle className=" w-32 h-32 my-4"/>
                    <span>Send a message</span>
                </div>)
            }
        </div>
    )
}

export default ChatPage