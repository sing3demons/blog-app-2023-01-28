const { Router } = require('express')
const router = Router()

const { jwtValidate, jwtRefreshTokenVerify } = require('../middleware/jwt')

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

const controller = require('../controllers/user')

router.post('/register', async (req, res) => {
  try {
    await controller.register(req)

    res.status(201).json({ message: 'User created successfully' })
  } catch ({ message }) {
    throwError(message)
  }
})

router.post('/login', async (req, res) => {
  try {
    const token = await controller.login(req)
    res.status(200).json(token)
  } catch ({ message }) {
    throwError(message)
  }
})

router.get('/profile', jwtValidate, async (req, res) => {
  try {
    const response = await controller.profile(req)
    res.status(200).json(response)
  } catch ({ message }) {
    throwError(message)
  }
})

router.post('/refresh-token', jwtRefreshTokenVerify, async (req, res) => {
  try {
    const response = await controller.refreshToken(req)
    res.status(200).json(response)
  } catch ({ message }) {
    throwError(message)
  }
})

module.exports = router
