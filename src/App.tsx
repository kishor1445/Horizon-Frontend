import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from '@/components/Login/Login'
import AdminDashboard from '@/components/AdminDashboard/AdminDashboard'
import AdminEvents from '@/components/AdminDashboard/AdminEvents/AdminEvents'
import AdminStatus from '@/components/AdminDashboard/AdminStatus/AdminStatus'
import LoginOrDashboard from './components/LoginOrDashboard'
import '@/App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/admin' element={<LoginOrDashboard />} />
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      <Route path='/admin/events' element={<AdminEvents />} />
      <Route path='/admin/status' element={<AdminStatus />} />
    </Routes>
  )
}

export default App