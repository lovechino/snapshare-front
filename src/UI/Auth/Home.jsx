import React from 'react'
import { Feed } from '../../Components/Feed'
import { Outlet } from 'react-router-dom'
import { RightBar } from '../../Components/RightBar'
import getAllPost from '../../hooks/getAllPost'
import getSuggestUser from '../../hooks/getSuggestUser'
import getMutualUser from '../../hooks/getMutualFollower'

function Home() {
  getAllPost()
  getSuggestUser()
  getMutualUser()
  return (
    <div className='flex'>
      <div className=' grow '>
        <Feed/>
        <Outlet/>
      </div>
      <RightBar/>
    </div>
  )
}

export default Home