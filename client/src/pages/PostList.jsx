import React, { useEffect, useState } from 'react'
import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'
import { BASE_URI, URI } from '../utils/constant.js'

export default function PostList() {
  const [loading, setLoading] = useState(true)
  const [posts, setPost] = useState([])
  const fetchPost = async () => {
    const response = await fetch(URI + 'post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    setPost(data)
    console.log(data)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchPost()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <>
      {posts.length !== 0 &&
        posts.map(({ _id, title, author, createdAt, summary, cover }) => {
          console.log(author)
          return (
            <div className="post" key={_id}>
              <div className="image">
                <Link to={`post/${_id}`}>
                  <img src={`${BASE_URI}/images/${cover}`} alt="" />
                </Link>
              </div>
              <div className="texts">
                <h2>{title}</h2>
                <p className="info">
                  <a className="author">{author}</a>
                  <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">{summary}</p>
              </div>
            </div>
          )
        })}
    </>
  )
}
