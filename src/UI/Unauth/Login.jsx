import axios from "axios"
import React, { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { setAuthUser } from "../../Redux/authSlice"
import { notification } from "antd"

export const Login = ()=>{
    const [input,setInput] = useState({
        email :"",
        password:""
    })
    const key = 'updatable';
    const[api,contextHoler] = notification.useNotification()
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
    const{user} = useSelector(store=>store.auth)
    const[loading,setLoading] = useState(false)
    const changeEvent = (e)=>{
        setInput({...input,[e.target.name] : e.target.value})
    }
 

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signUpHandler = async(e)=>{
        e.preventDefault()
        try{
           setLoading(true)   
           const res = await axios.post("https://snapshare-back-2.onrender.com/api/user/login",input,{
            headers :{
                "Content-Type" : "application/json"
            },
            withCredentials : true
           })
           if(res.data){
             dispatch(setAuthUser(res.data.user))
             localStorage.setItem("Token",res.data.token)
             openNotification()
             setTimeout(() => {
                navigate("/");
            }, 200);
             
           }     
        // eslint-disable-next-line no-unused-vars
        }catch(err){
           FailNotification(err.message)
        }finally{
            setLoading(false)
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
                <div className="my-4 flex flex-col justify-center items-center">
                    {/* <img className="w-1/2 h-1/2" src={logo}/> */}
                    <h1 className="text-center font-bold text-2xl">SnapShare</h1>
                    <p className="text-center">Signup to connect your friends</p>
                </div>
                <div>
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
               {
                loading ? (
                    <button  className="w-full bg-blue-300 px-3 py-2 hover:cursor-pointer">Please wait</button>
                ):(
                    <button  className="w-full bg-blue-300 px-3 py-2 hover:cursor-pointer">Login</button>
                )
               }
                <span className="text-center">Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link></span>
            </form>
        </div>
    )
}