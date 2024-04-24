import React, { useState } from 'react'
import { Eye, EyeOff, KeyRound, LoaderCircle, LogIn, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ACM_LOGO from "@/assets/acm_logo.png"
import client from '@/lib/axios_utils'
import "@/components/Login/style.css"

const Login: React.FC = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [InvalidCredentials, setInvalidCredentials] = useState(false);
  const [InvalidUserName, setInvalidUserName] = useState('');
  const [InvalidPassWord, setInvalidPassWord] = useState('');
  const [userName, setuserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [Loading, setLoading] = useState(false);

  const show_password = () => {
    if (showPassword == false) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  }

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true);
    setInvalidCredentials(false);
    if (userName === '') {
      setInvalidUserName("Username cannot be empty")
    }
    if (passWord === '') {
      setInvalidPassWord("Password cannot be empty")
    }
    const data = new FormData();
    data.append("username", userName);
    data.append("password", passWord);
    console.log(data)
    await client.post("/admin/login", data, {'headers': {'Content-Type': 'multipart/form-data'}}).then(
    (res) => {
      localStorage.setItem("ACM_SIST_TOKEN", res.data.access_token)
      location.href = "/admin/dashboard"
    }).catch((err) => {
      if (err.response.status == 401) {
        setInvalidCredentials(true)
      }
    })
    setLoading(false)
  }

  const handleKeys = (value: string, func: Function, error_func: Function) => {
    error_func('')
    func(value)
  }

  return (
    <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-space-y-4'>
        <img src={ACM_LOGO} width={160} />
        <div className='tw-text-center'>
          <h1 className='tw-text-4xl gradient-text'>ACM-SIST</h1>
          <p className='tw-text-gray-400'>Please enter your credentials</p>
        </div>
        {
          InvalidCredentials ? <p className='tw-text-destructive'>Invalid Credentials</p> : ''
        }
        <form onSubmit={login} className='tw-space-y-6'>
            <div className='tw-relative'>
              <User className={`form_input_icon ${InvalidCredentials || InvalidUserName != '' ? 'error-text' : ''}`} />
              <Input disabled={Loading} name="username" id='username' className={`login_form_input ${InvalidCredentials || InvalidUserName != '' ? 'error-input' : ''}`} placeholder='Username' onChange={(e) => handleKeys(e.target.value, setuserName, setInvalidUserName)} value={userName}/>
              {
                InvalidUserName != '' ? <p className='error-text tw-text-center'>{InvalidUserName}</p> : <></>
              }
            </div>
            <div className='tw-relative'>
              <KeyRound className={`form_input_icon ${InvalidCredentials || InvalidPassWord ? 'error-text' : ''}`} />
              <Input disabled={Loading} name="password" id='password' type={showPassword ? 'text' : 'password'} className={`login_form_input ${InvalidCredentials || InvalidPassWord ? 'error-input' : ''}`} placeholder='Password' onChange={(e) => handleKeys(e.target.value, setPassWord, setInvalidPassWord)} value={passWord} />
              <Button type='button' onClick={show_password} className='tw-border-none tw-absolute tw-right-0 tw-top-0 tw-bg-transparent hover:tw-bg-transparent' variant={'outline'}>{showPassword ? <Eye /> : <EyeOff />}</Button>
              {
                InvalidPassWord != '' ? <p className='error-text tw-text-center'>{InvalidPassWord}</p> : <></>
              }
            </div>
            <Button disabled={Loading} className='tw-w-full tw-font-bold'>{Loading ? <p className='tw-flex tw-items-center tw-text-lg tw-whitespace-pre'>Loading <LoaderCircle className='tw-animate-spin tw-size-9' /></p> : <p className='tw-flex tw-whitespace-pre tw-items-center'>Login <LogIn /></p>}</Button>
        </form>
    </div>
  )
}

export default Login