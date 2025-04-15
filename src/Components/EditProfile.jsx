import { Avatar, Select } from "antd";
import axios from "axios";
import { Link } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../Redux/authSlice";


// const readFileAsDataUrl = (file) => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (typeof reader.result === "string") resolve(reader.result);
//     };
//     reader.readAsDataURL(file);
//   });
// };
const token = localStorage.getItem("Token")
const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef()
  const[profilePicture,setProfilePicture] = useState(user?.profilePicture)
  const[bio,setBio] = useState(user?.bio)
  const[gender,setGender] = useState(user?.gender)
  const navigate = useNavigate()
  const dispatch =  useDispatch()

  const fileChangeHandler = async (e) =>{
    const file = e.target.files?.[0]
    if(file) {
        // setProfilePicture(file)
        // const dataUrl = await readFileAsDataUrl(file)
        setProfilePicture(file)
    }
  }
  const editProfileHandler = async ()=>{
    // const formData = new FormData()
    // formData.append("bio",bio)
    // formData.append("gender",gender)
    // if(profilePicture){
    //   formData.append("profilePicture",profilePicture)
    // }
    
    const response = await axios.post(`https://snapshare-back-2.onrender.com/api/user/profile/edit`,{bio,gender,profilePicture},{
      headers:{
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
      withCredentials : true
    }).catch(error=>{
      if(error.response && error.response.status === 401){
         navigate("/login")
      }
    })
    if(response.status == 200){
       const updateUser = {
        ...user,
        bio : response.data.getUser?.bio,
        profilePicture : response.data.getUser?.profilePicture,
        gender : response.data.getUser?.gender
       }
       dispatch(setAuthUser(updateUser))
       navigate(`/profile/${user?._id}`)
    }else{
      alert("nice")
    }
  }
  // console.log(profilePicture)

  return (
    <div className=" flex max-w-2xl mx-auto pl-10">
      <section className=" flex flex-col gap-6 w-full">
        <h2 className="font-bold text-xl">Edit Profile</h2>
        <div className=" flex items-center justify-between bg-gray-100 rounded-xl">
          <div className=" flex items-center gap-3">
            <div className=" flex items-center gap-2">
              <Avatar size={100} src= {profilePicture} alt="nice" />
              {/* <img src= {profilePicture}/> */}
              <div className=" flex flex-col  gap-1">
                <span>{user?.username}</span>
                <span className=" text-gray-600 text-sm">
                  {user?.bio || "bio"}
                </span>
              </div>
            </div>
          </div>
          <input onChange={fileChangeHandler} ref={imageRef} type="file" className="hidden"/>
          <button onClick={()=>imageRef.current.click()} className="text-white bg-blue-500 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Change Photo</button>
        </div>
        <div>
            <div className=" font-bold text-xl mb-2">Bio</div>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} className="w-full h-20 focus-visible:ring-transparent border border-black" placeholder="Bio"/>
        </div>
        <div>
            <div className="font-bold text-xl mb-2">Gender</div>
            <Select
            defaultValue= {gender}
            style={{ width: 120 }}
            onChange={e=>setGender(e)}
            options={[
                { value: 'male', label: 'male' },
                { value: 'female', label: 'female' },
                { value: 'other', label: 'other' },
               
              ]}
            />
        </div>
        <div>
            <button onClick={editProfileHandler} className="w-1/2 bg-blue-300 px-3 py-2 rounded-2xl">Submit</button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
