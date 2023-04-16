import express from 'express'
import debug from 'debug'
import { AuthorizationCode } from 'simple-oauth2'
import type { User } from './types'

const log = debug('oauth')
const router = express.Router()

const config = {
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  },
  auth: {
    tokenHost: process.env.OAUTH_PREFIX || 'https://my-oauth-example.online',
    tokenPath: process.env.OAUTH_TOKEN_PATH || '/oauth/token',
    authorizePath: process.env.OAUTH_AUTHZ_PATH || '/oauth/authorize',
  },
}

const cookieName = process.env.COOKIE_NAME || 'user'
const scope = process.env.OAUTH_SCOPE || 'openid'
const fieldUid = process.env.OAUTH_FIELD_UID || 'uid'

const client = new AuthorizationCode(config)

const randomString = length =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

router.get('/start', (req, res) => {
  const state = randomString(24)
  const authorizationUri = client.authorizeURL({
    redirect_uri: process.env.OAUTH_CALLBACK_URL || `${req.protocol}://${req.hostname}/auth/cb`,
    scope,
    state,
  })
  log('redirect to: %s', authorizationUri)
  res.redirect(authorizationUri)
})

router.get('/cb', async (req, res) => {
  const { code } = req.query
  const options = { code }

  try {
    const resp = await client.getToken(options)
    res.header('Refresh', '3;url=/')
    log('The resulting token: %s', resp.token)
    let outout = '<h3>Welcome back'
    if (resp.token[fieldUid]) {
      // TODO: more fields
      const user: User = { uid: resp.token[fieldUid], hit: Date.now() }
      res.cookie(cookieName, user, { httpOnly: true })
      outout = `${outout} ${user.uid}`
    }
    outout = `${outout} <a href="/">click to home</a>`

    res.send(outout)
  }
  catch (error) {
    log('Access Token Error: %s', error.message)
  }
})

router.get('/me', async (req, res) => {
  const user: User = req.cookies[cookieName]
  if (user)
    res.json({ status: 'Success', data: user })

  else
    res.json({ status: 'Fail', message: 'need login', data: null })
})

router.get('/', (req, res) => {
  res.send('<br><a href="/auth/start">Log in with OAuth</a>')
})

export { router }
