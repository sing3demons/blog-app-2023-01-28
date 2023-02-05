const { Router } = require('express')

const router = Router()
const controller = require('../controllers/post')
const { jwtValidate } = require('../middleware/jwt.js')

const throwError = message => {
  switch (message) {
    case 'Invalid credentials':
      return res.status(400).json({ error: 'Invalid credentials' })
    case 'User not found':
      return res.status(404).json({ error: 'User not found' })
    default:
      return res.status(500).json({ error: message })
  }
}

router.get('/', async (req, res) => {
  try {
    const posts = await controller.PostList(req)
    res.status(200).json(posts)
  } catch ({ message }) {
    throwError(message)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const post = await controller.getPost(req)
    res.status(200).json(post)
  } catch ({ message }) {
    throwError(message)
  }
})

router.post('/', jwtValidate, async (req, res) => {
  try {
    const post = await controller.createPost(req)

    res.status(201).json({
      message: 'เพิ่มข้อมูลเรียบร้อย',
      post,
    })
  } catch ({ message }) {
    throwError(message)
  }
})

module.exports = router
