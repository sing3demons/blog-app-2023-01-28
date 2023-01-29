const jwt = require('jsonwebtoken')

const generateJWT = user => {
  const accessToken = jwt.sign({ sub: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ sub: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
  return { accessToken, refreshToken }
}

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)

    const token = req.headers['authorization'].replace('Bearer ', '')

    const { sub, exp } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const tokenDt = { userId: sub, exp }

    req.tokenDt = tokenDt
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

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

module.exports = {
  generateJWT,
  jwtValidate,
  jwtRefreshTokenVerify,
}
