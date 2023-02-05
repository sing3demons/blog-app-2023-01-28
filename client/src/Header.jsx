import React, { useContext, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from './userContext.js'
import { URI } from './utils/constant.js'

export default function Header() {
  const [loading, setLoading] = useState(true)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()
  const alert = useAlert()

  const fetchData = async ({ accessToken, refreshToken }) => {
    try {
      const response = await fetch(URI + 'auth/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      })
      // console.log(response.status)

      if (response.status === 403) {
        const result = await fetch(URI + 'auth/refresh-token', {
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
    } catch (error) {
      navigate('/login')
    }
  }

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token')

    if (token) {
      fetchData(JSON.parse(token))
      setLoading(false)
    } else {
      navigate('/login')
      setLoading(false)
    }
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    alert.show('logout', { timeout: 2000, position: 'top center' })

    setUserInfo(null)
    navigate('/login')
  }
  const { username } = userInfo

  if (loading) return <div>Loading...</div>

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>

      <nav>
        <Link to="/create">{username}</Link>
        <a onClick={() => logout()}>logout</a>
      </nav>
    </header>
  )
}
