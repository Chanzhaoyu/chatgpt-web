import type { UserRole } from '../storage/model'
import { TextAudioType } from '../storage/model'
import type { TextAuditServiceProvider } from './textAudit'

export function isNumber<T extends number>(value: T | unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]'
}

export function isString<T extends string>(value: T | unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}

export function isNotEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0
}

export function isBoolean<T extends boolean>(value: T | unknown): value is boolean {
  return Object.prototype.toString.call(value) === '[object Boolean]'
}

export function isFunction<T extends (...args: any[]) => any | void | never>(value: T | unknown): value is T {
  return Object.prototype.toString.call(value) === '[object Function]'
}

export function isEmail(value: any): boolean {
  return isNotEmptyString(value) && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

export function isTextAuditServiceProvider(value: any): value is TextAuditServiceProvider {
  return value === 'baidu' // || value === 'ali'
}

export function isTextAudioType(value: any): value is TextAudioType {
  return (
    value === TextAudioType.None
    || value === TextAudioType.Request
    || value === TextAudioType.Response
    || value === TextAudioType.All
  )
}

export function hasAnyRole(userRoles: UserRole[] | undefined, roles: UserRole[]): boolean {
  if (!userRoles || userRoles.length === 0 || !roles || roles.length === 0)
    return false

  const roleNames = roles.map(role => role.toString())
  return roleNames.some(roleName => userRoles.some(userRole => userRole.toString() === roleName))
}
