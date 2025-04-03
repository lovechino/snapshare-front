import { Avatar } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SuggestUser } from "./SuggestUser";
import avatarDefault from "../assets/img_avatar.png"
export const RightBar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className=" w-fit my-10 pr-32 max-sm:hidden max-md:hidden">
      <div className=" flex items-center gap-2">
        <Link to= {`/profile/${user?._id}`}>
          {
            user?.profilePicture === "" ? (
              <Avatar src={avatarDefault} />
            ) : (
              <Avatar src={user?.profilePicture} />
            )
          }
        </Link>
        <div className=" flex flex-col  gap-1">
          <span>{user?.username}</span>
          <span className=" text-gray-600 text-sm">{user?.bio || "bio"}</span>
        </div>
      </div>
      <SuggestUser />
    </div>
  );
};
