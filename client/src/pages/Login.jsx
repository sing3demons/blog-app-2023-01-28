import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'

import { UserContext } from '../userContext.js'
import { URI } from '../utils/constant.js'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const alert = useAlert()

  const { setUserInfo } = useContext(UserContext)

  const onSubmit = async ({ username, password }) => {
    const response = await fetch(URI + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', JSON.stringify(data))

      setUserInfo(data)
      alert.success('Login successful')
      navigate('/')
    } else return alert.error(JSON.stringify(data))
  }

  return (
    <form className="login" onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>
      <input type="text" placeholder="username" {...register('username')} />
      <input type="password" placeholder="password" {...register('password')} />
      <div className="login">
        <button onClick={() => navigate('/register')} className="button" type="button">
          สมัครสมาชิก
        </button>
        <button className="login" type="submit">
          Login
        </button>
      </div>
      <button onClick={() => navigate('/register')} type="button" className="button">
        ลืมรหัสผ่าน?
      </button>
    </form>
  )
}
