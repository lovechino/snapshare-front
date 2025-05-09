import { notification } from "antd"
import axios from "axios"
import React, { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export const SignUp = ()=>{
    const [input,setInput] = useState({
        username : "",
        email :"",
        password:""
    })
    const key = 'updatable';
    const[api,contextHoler] = notification.useNotification()
    const{user} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    
    const changeEvent = (e)=>{
        setInput({...input,[e.target.name] : e.target.value})
    }
    const openNotification = ()=>{
        setTimeout(()=>{
            api.open({
                key,
                message: 'Login Success',
                description: "Login"
            })
        },1000)
    }
    const FailNotification = (value)=>{
        setTimeout(()=>{
            api.open({
                key,
                message: 'Login Fail',
                description: value
            })
        },1000)
    }
   
    const signUpHandler = async(e)=>{
        e.preventDefault()
        try{
           const res = await axios.post("https://snapshare-back-2.onrender.com/api/user/register",input,{
            headers :{
                "Content-Type" : "application/json"
            },
            // withCredentials : true
           })
           if(res.status == 200){
            navigate("/login")
            openNotification()
           }
        }catch(err){
            FailNotification(err.message) 
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/")
        }
    })
    return (
        <div className=" flex items-center justify-center w-screen h-screen">
         {contextHoler}
            <form onSubmit={signUpHandler} className="shadow-lg flex flex-col gap-5 p-8 ">
                <div className="my-4">
                    <h1 className="text-center font-bold text-2xl">SnapShare</h1>
                    <p className="text-center">Signup to connect your friends</p>
                </div>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" placeholder="username"
                    value={input.username}
                    onChange = {changeEvent}
                     className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "/>
                    <label>Email</label>
                    <input type="text" name="email" placeholder="email"
                    value={input.email}
                    onChange = {changeEvent}
                     className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "/>
                    <label>Password</label>
                    <input type="password" name="password"
                    value={input.password}
                    onChange={changeEvent}
                     placeholder="password" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"/>
                </div>
                <button  className="w-full bg-blue-300 px-3 py-2 hover:cursor-pointer">Sign Up</button>
                <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
            </form>
        </div>
    )
}