const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateJWT = user => {
  const accessToken = jwt.sign({ sub: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ sub: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
  return { accessToken, refreshToken }
}

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

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)

    const token = req.headers['authorization'].replace('Bearer ', '')

    const { sub, exp } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const tokenDt = { userId: sub, exp }

    req.tokenDt = tokenDt
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(403)
  }
}

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

const jwtRefreshTokenVerify = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)
    const token = req.headers['authorization'].replace('Bearer ', '')

    const { sub } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const refreshToken = { userId: sub }
    req.refreshToken = refreshToken

    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

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
