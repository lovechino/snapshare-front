import { notification } from "antd"
import axios from "axios"
import { useState } from "react"


const ResetPassword = ()=>{
    const key = "change password"
    const[email,setEmail] = useState("")
    const[api,contextHoler] = notification.useNotification()
    const openNotification = ()=>{
        setTimeout(()=>{
            api.open({
                key,
                message: 'Admin Message',
                description: "Email is sent"
            })
        },1000)
    }
    const failNotification = ()=>{
        setTimeout(()=>{
            api.open({
                key,
                message: 'Admin Message',
                description: "Check your email please"
            })
        },1000)
    }
    const handleSubmit = async ()=>{
        const response = await axios.post(`https://snapshare-back-2.onrender.com/api/user/reset-password`,{
            email : email
        },{
            headers:{
                "Content-Type": "application/json",
            }
        })
      if(response.status == 200){
        openNotification()
      }else{
        failNotification()
      }
    }
    return(
        <div className="flex items-center justify-center w-screen h-screen">
            {contextHoler}
            <div className="shadow-lg flex flex-col gap-5 p-20">
                <h1 className=" text-center text-2xl">Reset Password</h1>
                <div className=" flex items-center gap-4">
                    <label>Email</label>
                    <input placeholder="Email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"/>
                </div>
                <button onClick={handleSubmit} className="w-full bg-blue-300 rounded-full px-3 py-2 hover:cursor-pointer">Send Email</button>
            </div>
        </div>
    )
}

export default ResetPassword