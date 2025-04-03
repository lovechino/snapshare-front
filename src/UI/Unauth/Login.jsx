import axios from "axios"
import React, { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { setAuthUser } from "../../Redux/authSlice"
// import logo from "/public/logo-search-grid-1x.png"
export const Login = ()=>{
    const [input,setInput] = useState({
        email :"",
        password:""
    })
    const{user} = useSelector(store=>store.auth)
    const[loading,setLoading] = useState(false)
    const changeEvent = (e)=>{
        setInput({...input,[e.target.name] : e.target.value})
    }
    // const notify = ()=> toast("aaaaaaaaaaa")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signUpHandler = async(e)=>{
        e.preventDefault()
        try{
           setLoading(true)
           const sucessNotify = ()=>toast("Login Sucessful")
           const res = await axios.post("http://localhost:3000/api/user/login",input,{
            headers :{
                "Content-Type" : "application/json"
            },
            withCredentials : true
           })
           if(res.data){
             dispatch(setAuthUser(res.data.user))
             navigate("/")
             sucessNotify()
           }     
        }catch(err){
           const errNotify = ()=>toast(err)
           errNotify()
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
            <ToastContainer/>
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
                    <button  className="w-full bg-blue-300 px-3 py-2">Please wait</button>
                ):(
                    <button  className="w-full bg-blue-300 px-3 py-2">Login</button>
                )
               }
                <span className="text-center">Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link></span>
            </form>
        </div>
    )
}