import { rateLimit } from 'express-rate-limit'
import { isNotEmptyString } from '../utils/is'

const MAX_REQUEST_PERHOUR = process.env.MAX_REQUEST_PERHOUR

const limiter = isNotEmptyString(MAX_REQUEST_PERHOUR)
  ? rateLimit({
    windowMs: 60 * 60 * 1000, // 1 小时内最多访问次数
    max: parseInt(MAX_REQUEST_PERHOUR), // 最大请求数,
    message: 'Too many request from this IP in 1 hour',
  })
  : rateLimit({
    windowMs: 60 * 60 * 1000, // 1 小时内最多访问次数
    max: 36000, // 最大请求数,
    message: 'Too many request from this IP in 1 hour',
  })

export { limiter }
