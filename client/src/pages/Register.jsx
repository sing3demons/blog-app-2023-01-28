import React from 'react'
import { useForm } from 'react-hook-form'

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const onSubmit = data => console.log(data)

  return (
    <form className="login" onSubmit={handleSubmit(onSubmit)}>
      <h1>Register</h1>
      <input type="text" placeholder="username" {...register('username')} />
      <input type="password" placeholder="password" {...register('password')} />
      <button>Login</button>
    </form>
  )
}
