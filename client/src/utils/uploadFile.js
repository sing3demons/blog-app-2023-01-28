import Resizer from 'react-image-file-resizer'

const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0, uri => resolve(uri), 'base64')
  })

// const convertFileToBase64 = file =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onload = () => resolve(reader.result)
//     reader.onerror = reject
//   })
// const uploadedImageBase64 = await convertFileToBase64(image)

export { resizeFile }
