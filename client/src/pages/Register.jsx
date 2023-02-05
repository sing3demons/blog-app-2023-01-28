import React from 'react'
import { useAlert } from 'react-alert'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { URI } from '../utils/constant.js'

export default function Register() {
  const { register, handleSubmit } = useForm()

  const navigate = useNavigate()
  const alert = useAlert()

  const onSubmit = async ({ username, password }) => {
    const response = await fetch(URI + 'auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.status !== 201) return alert.error(JSON.stringify(data))

    alert.success('Registration successful')
    navigate('/login')
  }

  return (
    <form className="register" onSubmit={handleSubmit(onSubmit)}>
      <h1>Register</h1>
      <input type="text" placeholder="username" {...register('username')} />
      <input type="password" placeholder="password" {...register('password')} />
      <button className="register">Register</button>
    </form>
  )
}
