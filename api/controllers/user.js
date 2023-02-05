const { generateJWT } = require('../middleware/jwt.js')
const User = require('../models/User')

exports.register = async req => {
  try {
    const { username, password } = req.body
    let user = new User()
    user.username = username
    user.password = await user.encryptPassword(password)

    await user.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.login = async req => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) throw new Error('User not found')

    const isValid = await user.checkPassword(password)
    if (!isValid) throw new Error('Invalid credentials')

    return await generateJWT(user)
  } catch (error) {
    throw new Error(error.message)
  }
}

const getUserById = async id => {
  try {
    return await User.findById(id)
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.profile = async req => {
  try {
    const { userId, exp } = req.tokenDt
    const { _id, username } = await getUserById(userId)

    const response = {
      _id,
      username,
      expiresIn: exp,
    }

    return response
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.refreshToken = async req => {
  const { userId } = req.refreshToken
  const user = await getUserById(userId)

  if (!user) return res.sendStatus(401)

  const { accessToken, refreshToken } = generateJWT(user)

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  }
}
