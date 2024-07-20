export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export function formatCommentTime(time: string) {
  const now = new Date()
  const inputTime = new Date(time)
  const diff = now - inputTime

  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  const year = day * 365

  if (diff < minute)
    return '刚刚'
  else if (diff < hour)
    return `${Math.floor(diff / minute)}分钟前`
  else if (diff < day)
    return `${Math.floor(diff / hour)}小时前`
  else if (diff < year)
    return inputTime.toISOString().slice(5, 10)
  else
    return inputTime.toISOString().slice(0, 10)
}
