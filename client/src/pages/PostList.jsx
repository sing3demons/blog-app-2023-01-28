import React, { useEffect, useState } from 'react'
import { formatISO9075 } from 'date-fns'

export default function PostList() {
  const [loading, setLoading] = useState(true)
  const [posts, setPost] = useState([])
  const fetchPost = async () => {
    const response = await fetch('http://127.0.0.1:8080/api/post', {
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

  loading && <div>Loading...</div>

  return (
    <>
      {posts.length !== 0 &&
        posts.map(({ _id, title, author, createdAt, summary, cover }) => {
          // console.log(post)
          return (
            <div className="post" key={_id}>
              <div className="image">
                <img src={`http://localhost:8080/images/${cover}`} alt="" />
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