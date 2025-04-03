import { Avatar } from "antd"
import avatarDefault from "../assets/img_avatar.png"
const CommentView = ({comment})=>{
    return (
        <div className=" my-2">
            <div className=" flex gap-3 items-center">
                <div>
                    <Avatar src = {comment?.author?.profilePicture || avatarDefault}/>
                </div>
                <div className=" font-bold text-sm">{comment?.author.username} <span className="font-normal">{comment?.text}</span></div>
            </div>
        </div>
    )
}

export default CommentView