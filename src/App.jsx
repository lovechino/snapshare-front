import { useEffect } from "react"
import EditProfile from "./Components/EditProfile"
import ChatPage from "./UI/Auth/ChatPage"
import Home from "./UI/Auth/Home"
import MainLayout from "./UI/Auth/MainLayout"
import Profile from "./UI/Auth/Profile"
import { Login } from "./UI/Unauth/Login"
import { SignUp } from "./UI/Unauth/SignUp"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "./Redux/socketSlice"
import { setOnlineUser } from "./Redux/chatSlice"
import { setLikeNotification } from "./Redux/notificationSlice"
import { ProtectedRoutes } from "./hooks/protectedRoutes"
import { setMessNoti } from "./Redux/messNoti"

const browerRouter = createBrowserRouter([
  {
    path: "/",
    element : <ProtectedRoutes> <MainLayout/> </ProtectedRoutes> ,
    children :[
      {
        path : "/",
        element : <Home/>
      },
      {
        path :'/profile/:id',
        element : <Profile/>
      },
      {
        path :'/profile/edit',
        element : <EditProfile />
      },
      {
        path : '/chat',
        element : <ChatPage/>
      }
    ]
  },
  {
    path:'/login',
    element : <Login/>,
    
  },
  {
    path:'/signup',
    element : <SignUp/>
  }
])

function App() {
  const {user} = useSelector(store=>store.auth)
  const{socket} = useSelector(store=>store.socketio)
  const dispatch = useDispatch()
  useEffect(()=>{
    if(user){
      const socketop = io('http://localhost:3000',{
        query:{
          userId : user?._id 
        },
        transports:['websocket']
      })
      dispatch(setSocket(socketop))

      socketop.on('getOnlineUsers',(onlineUser)=>{
        dispatch(setOnlineUser(onlineUser))
      })
      socketop.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })
      socketop.on('notiMessage',(notiMessage)=>{
        dispatch(setMessNoti(notiMessage))
      })
      return()=>{
        socketop.close()
        dispatch(setSocket(null))
      }
    }else if(socket){
      socket?.close()
      dispatch(setSocket(null))
    }
  },[user,dispatch])
  return (
   <>
     <RouterProvider  router={browerRouter}/>
   </>
  )
}

export default App
