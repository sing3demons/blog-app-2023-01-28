import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'
import { BASE_URI, URI } from '../utils/constant.js'

export default function PostItem() {
  const [postInfo, setPostInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  const fetchPost = async id => {
    const response = await fetch(URI + `post/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (response.ok) {
      setPostInfo(data)

      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchPost(id)
  }, [])

  if (loading) return <div>Loading...</div>
  console.log(postInfo)

  const { _id, title, author, createdAt, summary, cover, content } = postInfo
  return (
    <div className="post-page">
      <h1>{title}</h1>
      <time>{formatISO9075(new Date(createdAt))}</time>
      <div className="author">by @{author.username}</div>
      {author && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${_id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`${BASE_URI}/images/${cover}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
