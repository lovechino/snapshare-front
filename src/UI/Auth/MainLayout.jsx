import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../Components/SideBar'

function MainLayout() {
  return (
    <div>
        <SideBar/>
        <div>
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default MainLayout