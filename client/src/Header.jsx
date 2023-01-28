import React, { useContext, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './userContext.js'

export default function Header() {
  const [loading, setLoading] = useState(true)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()
  const alert = useAlert()

  console.log(userInfo)

  useEffect(() => {
    setLoading(true)

    const token = localStorage.getItem('token')

    if (token) {
      const { accessToken } = JSON.parse(token)
      console.log(accessToken)

      const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8080/api/auth/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        })
        const data = await response.json()

        console.log(data)

        setUserInfo(data)
        localStorage.setItem('profile', JSON.stringify(data))
        setLoading(false)
      }

      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    alert.success('logout')

    setUserInfo(null)
    navigate('/login')
    navigate(0)
  }
  const { username } = userInfo

  if (loading) return <div>Loading...</div>

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>

      <nav>
        <Link to="/profile">{username}</Link>
        <a onClick={() => logout()}>logout</a>
      </nav>
    </header>
  )
}
