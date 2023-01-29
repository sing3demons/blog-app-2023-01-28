import React, { useContext, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './userContext.js'

export default function Header() {
  const [loading, setLoading] = useState(true)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()
  const alert = useAlert()

  const fetchData = async ({ accessToken, refreshToken }) => {
    const response = await fetch('http://127.0.0.1:8080/api/auth/profile', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    })
    // console.log(response.status)

    if (response.status === 403) {
      const result = await fetch('http://127.0.0.1:8080/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` },
      })

      const newToken = await result.json()
      localStorage.removeItem('token')
      localStorage.removeItem('profile')
      localStorage.setItem('token', JSON.stringify(newToken))
      navigate(0)
      console.log('refresh token')
      console.log(newToken)
    }
    const data = await response.json()
    setUserInfo(data)
    localStorage.setItem('profile', JSON.stringify(data))
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')
    // console.log(JSON.parse(token))
    if (token) {
      // const { accessToken, refreshToken } = JSON.parse(token)
      fetchData(JSON.parse(token)).catch(err => navigate('/login'))
    } else {
      navigate('/login')
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    alert.show('logout', { timeout: 2000, position: 'top center' })

    setUserInfo(null)
    navigate('/login')
    // navigate(0)
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
