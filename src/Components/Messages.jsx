import { useSelector } from "react-redux"
import getAllMessage from "../hooks/getAllMessage"
import getRTM from "../hooks/getRTM"

const Messages = ()=>{
    getRTM()
    getAllMessage()
    const{user,mutualUser} = useSelector(store=>store.auth)
    const{messages} = useSelector(store=>store.chat)
    console.log(mutualUser)
    return(
        <div className="overflow-y-auto flex-1 p-4">
            <div className=" flex flex-col gap-3">
                {
                   messages && messages.map((msg)=>{
                    // console.log(user._id === msg.senderId)
                        return(
                            <div key={msg._id} className= {` flex ${user._id === msg.senderId ?" justify-end" : "justify-start"}`}>
                                <div className= {`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user._id ? 'bg-blue-500 text-white':'bg-gray-50'}`}>{msg.message}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages