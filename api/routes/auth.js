const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const { generateJWT, jwtValidate, jwtRefreshTokenVerify } = require('../middleware/jwt')

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    let user = new User()
    user.username = username
    user.password = await user.encryptPassword(password)

    await user.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) throw new Error('User not found')

    const isValid = await user.checkPassword(password)
    if (!isValid) throw new Error('Invalid credentials')

    const token = generateJWT(user)
    res.status(200).json(token)
  } catch ({ message }) {
    switch (message) {
      case 'Invalid credentials':
        return res.status(400).json({ error: 'Invalid credentials' })
      case 'User not found':
        return res.status(404).json({ error: 'User not found' })
      default:
        return res.status(500).json({ error: message })
    }
  }
})

router.get('/profile', jwtValidate, async (req, res) => {
  const { userId, exp } = req.tokenDt
  const { _id, username } = await User.findById(userId)

  const response = {
    _id,
    username,
    expiresIn: exp,
  }
  res.json(response)
})

router.post('/refresh-token', jwtRefreshTokenVerify, async (req, res) => {
  const { userId } = req.refreshToken
  const user = await User.findById(userId)

  if (!user) return res.sendStatus(401)

  const { accessToken, refreshToken } = generateJWT(user)

  return res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
})

module.exports = router
