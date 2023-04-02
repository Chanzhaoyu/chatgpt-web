import { createHash } from 'crypto'
import * as dotenv from 'dotenv'
import { getCacheConfig } from '../storage/config'

dotenv.config()

export function md5(input: string) {
  input = input + process.env.PASSWORD_MD5_SALT
  const md5 = createHash('md5')
  md5.update(input)
  return md5.digest('hex')
}

// 可以换 aes 等方式
export async function getUserVerifyUrl(username: string) {
  const sign = getUserVerify(username)
  const config = await getCacheConfig()
  return `${config.siteConfig.siteDomain}/#/chat/?verifytoken=${sign}`
}

function getUserVerify(username: string) {
  const expired = new Date().getTime() + (12 * 60 * 60 * 1000)
  const sign = `${username}-${expired}`
  return `${sign}-${md5(sign)}`
}

export function checkUserVerify(verify: string) {
  const vs = verify.split('-')
  const sign = vs[vs.length - 1]
  const expired = vs[vs.length - 2]
  vs.splice(vs.length - 2, 2)
  const username = vs.join('-')
  // 简单点没校验有效期
  if (sign === md5(`${username}-${expired}`))
    return username
  throw new Error('Verify failed')
}
