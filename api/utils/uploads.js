const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const saveImageToDisk = async baseImage => {
  const projectPath = path.resolve('./')

  const uploadPath = `${projectPath}/public/images/`

  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'))

  let filename = ''
  if (ext === 'svg+xml') {
    filename = `${Date.now()}.svg`
  } else {
    filename = `${Date.now()}.${ext}`
  }

  // Extract base64 data from base64 string
  let image = decodeBase64Image(baseImage)
  console.log(filename)

  await writeFileAsync(uploadPath + filename, image.data, 'base64')
  return filename
}

const decodeBase64Image = base64Str => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  //   const image = {}
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }

  //   image.type = matches[1]
  //   image.data = matches[2]

  return {
    type: matches[1],
    data: Buffer.from(matches[2], 'base64'),
  }
}

module.exports = {
  saveImageToDisk,
}
