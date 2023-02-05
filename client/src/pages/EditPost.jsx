import React, { useEffect, useState } from 'react'
import Editor from '../Editor.jsx'
import { Navigate, useParams } from 'react-router-dom'
import { resizeFile } from '../utils/uploadFile.js'

export default function EditPost() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/post/' + id).then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title)
        setContent(postInfo.content)
        setSummary(postInfo.summary)
      })
    })
  }, [id])

  async function updatePost(ev) {
    ev.preventDefault()

    let body = {}
    body.title = title
    body.summary = summary
    body.content = content

    if (files?.[0]) {
      body.image = await resizeFile(files?.[0])
    }

    const token = localStorage.getItem('token')
    const { accessToken } = JSON.parse(token)

    const response = await fetch('http://127.0.0.1:8080/api/post/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    console.log(response)
    if (response.ok) {
      setRedirect(true)
    }
  }

  if (redirect) return <Navigate to={'/'} />

  return (
    <form onSubmit={updatePost}>
      <input type="title" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} />

      <input type="summary" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)} />
      <input type="file" onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  )
}
