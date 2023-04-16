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
  return getVerify(username, '')
}
function getVerify(username: string, key: string) {
  const expired = new Date().getTime() + (12 * 60 * 60 * 1000)
  const sign = `${username}${key}-${expired}`
  return `${sign}-${md5(sign)}`
}

function checkVerify(verify: string) {
  const vs = verify.split('-')
  const sign = vs[vs.length - 1]
  const expired = vs[vs.length - 2]
  vs.splice(vs.length - 2, 2)
  const prefix = vs.join('-')
  // 简单点没校验有效期
  if (sign === md5(`${prefix}-${expired}`))
    return prefix.split('|')[0]
  throw new Error('Verify failed')
}

export function checkUserVerify(verify: string) {
  return checkVerify(verify)
}

// 可以换 aes 等方式
export async function getUserVerifyUrlAdmin(username: string) {
  const sign = getUserVerifyAdmin(username)
  const config = await getCacheConfig()
  return `${config.siteConfig.siteDomain}/#/chat/?verifytokenadmin=${sign}`
}

function getUserVerifyAdmin(username: string) {
  return getVerify(username, `|${process.env.ROOT_USER}`)
}

export function checkUserVerifyAdmin(verify: string) {
  return checkVerify(verify)
}

export async function getUserResetPasswordUrl(username: string) {
  const sign = getUserResetPassword(username)
  const config = await getCacheConfig()
  return `${config.siteConfig.siteDomain}/#/chat/?verifyresetpassword=${sign}`
}

function getUserResetPassword(username: string) {
  return getVerify(username, '|rp')
}

export function checkUserResetPassword(verify: string, username: string) {
  const name = checkVerify(verify)
  if (name === username)
    return name
  throw new Error('Verify failed')
}
