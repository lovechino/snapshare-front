import ListPosts from "./ListPost"
import { Post } from "./Post"

export const Feed = ()=>{
    return (
        <div className=" flex-1 my-8 flex flex-col items-center pl-[-20%]">
            {/* <Post/> */}
            <ListPosts/>
        </div>
    )
}