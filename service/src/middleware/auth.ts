import jwt from 'jsonwebtoken'
import { isNotEmptyString } from '../utils/is'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const info = jwt.verify(token, AUTH_SECRET_KEY.trim())
      req.headers.userId = info.userId
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    // fake userid
    req.headers.userId = '6406d8c50aedd633885fa16f'
    next()
  }
}

export { auth }
