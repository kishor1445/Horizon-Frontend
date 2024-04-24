import { Button } from '@/components/ui/button'
import ACM_LOGO from '@/assets/acm_logo.png'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import "./style.css"

const AdminNavBar: React.FC = () => {
  
  const logout = () => {
    localStorage.removeItem("ACM_SIST_TOKEN")
    window.location.href = "/admin/login"
  }

  return (
    <nav className='tw-sticky tw-top-0 tw-z-50 tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-background'>
        <div className='tw-flex tw-items-center'>
            <img src={ACM_LOGO} width={80} />
            <NavLink to={'/admin/dashboard'} className='gradient-text tw-text-2xl'>ACM-SIST</NavLink>
        </div>
        <ul className='tw-flex tw-space-x-8 tw-text-xl tw-items-center'>
            <li><NavLink to='/admin/events' className='link'>Events</NavLink></li>
            <li><NavLink to='/admin/status' className='link'>Status</NavLink></li>
            <li><Button variant={'outline'} className='logout_btn' onClick={logout} ><LogOut /> Logout</Button></li>
        </ul>
    </nav>
  )
}

export default AdminNavBar