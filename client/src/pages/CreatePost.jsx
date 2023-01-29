import React, { useState } from 'react'
import { useAlert } from 'react-alert'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
}

export default function CreatePost() {
  const navigate = useNavigate()
  const alert = useAlert()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [image, setImage] = useState({ preview: '', raw: '' })
  const [content, setContent] = useState('')

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
    })
  }

  const createNewPost = async data => {
    // const uploadedImageBase64 = await convertFileToBase64(image.raw)
    const uploadedImageBase64 = await convertFileToBase64(data.image[0])
    data.image = uploadedImageBase64
    data.content = content

    const token = localStorage.getItem('token')
    const { accessToken } = JSON.parse(token)
    console.log(accessToken)

    const response = await fetch('http://127.0.0.1:8080/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok) {
      alert.success('create successful')
      navigate('/')
    } else {
      return alert.error(JSON.stringify(result))
    }
  }

  const handleChange = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(createNewPost)}>
      <input type="title" placeholder={'Title'} {...register('title', { required: true })} />
      <input type="summary" placeholder={'Summary'} {...register('summary', { required: true })} />
      {image.preview ? (
        <img src={image.preview} alt="dummy" width="300" height="300" />
      ) : (
        <h5 className="text-center">Upload your photo</h5>
      )}
      <input type="file" {...register('image', { required: true })} onChange={handleChange} />

      <ReactQuill value={content} onChange={setContent} modules={modules} />
      <button style={{ marginTop: '5px' }} type="submit">
        Create post
      </button>
    </form>
  )
}
