import { isNotEmptyString } from '../utils/is'

const cookieName = process.env.COOKIE_NAME || 'user'
const OAuthEnabled = isNotEmptyString(process.env.CLIENT_ID) && isNotEmptyString(process.env.CLIENT_SECRET)
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
const AuthKeyEnabled = isNotEmptyString(AUTH_SECRET_KEY)

const auth = async (req, res, next) => {
  if (OAuthEnabled) {
    const user = req.cookies[cookieName]
    if (user)
      next() // TODO: refresh the cookie lifetime
    else res.json({ status: 'Unauthorized', message: 'Please authenticate.', data: null })
  }
  else if (AuthKeyEnabled) {
    try {
      const Authorization = req.header('Authorization')
      if (!Authorization || Authorization.replace('Bearer ', '').trim() !== AUTH_SECRET_KEY.trim())
        throw new Error('Error: 无访问权限 | No access rights')
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth, cookieName }
