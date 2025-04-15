import { notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"


const ChangePassword = ()=>{
    const key = "test"
    const params = useParams();
    const navigate = useNavigate()
    const id = params.id
    const[password,setPassword] = useState("")
    const[confirm,setConfirm] = useState("")
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
                description: "Check your password again"
            })
        },1000)
    }
    const handleSubmit = async ()=>{
       if(password === confirm){
        const response = await axios.post(`https://snapshare-back-2.onrender.com/api/user/change-pw/${id}`,{
            password : password
        },{
            headers:{
                "Content-Type": "application/json",
            }
        })
        if(response.status === 200){
            openNotification()
            navigate("/login")
        }
       }else{
         failNotification()
       }
    }
    return(
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            {contextHoler}
            <div className="shadow-lg flex flex-col gap-5 p-20">
               <div className="text-2xl text-center">Change Pasword</div>
               <div>{id}</div>
                <div className=" grid grid-cols-2 gap-2 items-center">
                    <label className="justify-self-end">New Password</label>
                    <input type="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    className="  w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="New Password"
                    />
                </div>
                <div className=" grid grid-cols-2 gap-2 items-center">
                    <label className="justify-self-end">Confirm Password</label>
                    <input type="password"
                    value={confirm}
                    onChange={e=>setConfirm(e.target.value)}
                    className="  w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Confirm Password"
                    />
                </div>
                <button onClick={handleSubmit} className="w-full bg-blue-300 rounded-full px-3 py-2 hover:cursor-pointer">Send Email</button>
            </div>
        </div>
    )
}

export default ChangePassword