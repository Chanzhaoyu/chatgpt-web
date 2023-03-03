const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (typeof AUTH_SECRET_KEY === 'string' && AUTH_SECRET_KEY.length > 0) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      if (token.trim() !== AUTH_SECRET_KEY.trim())
        throw new Error('Invalid token')
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

export { auth }
