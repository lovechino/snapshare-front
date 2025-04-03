import React, { useEffect, useRef } from 'react'

function CommentDialog({open,setClose,children}) {
  const dialogRef = useRef(null)
  const handleClickOutside = (e)=>{
    if(dialogRef.current && !dialogRef.current.contains(e.target)){
      setClose()
    }
  }
  useEffect(()=>{
    if(open){
      document.addEventListener('mousedown',handleClickOutside)
    }else{
      document.removeEventListener('mousedown',handleClickOutside)
    }
    return ()=>{
      document.removeEventListener('mousedown',handleClickOutside)
    }
  },[open,setClose])
  return (
    <div className={` fixed inset-0 z-10 overflow-hidden flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
        <div ref={dialogRef} className= {`bg-white rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
            <button onClick={setClose} className=" absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600">X</button>
            {children}
        </div>
    </div>
  )
}

export default CommentDialog