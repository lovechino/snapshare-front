import { useSelector } from "react-redux"
import { Post } from "./Post"

const ListPosts = ()=>{
    const {posts} = useSelector(store=>store.post);
    return(
        <div>
        {
            posts?.map((post) => 
            
                <Post key={post._id} post={post}/>
            
            )
        }
        </div>
    )
}

export default ListPosts