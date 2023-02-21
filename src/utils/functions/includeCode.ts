function includeCode(text: string | null | undefined) {
  const regexp = /^(?:\s{4}|\t).+/gm
  if (text?.includes(' = ') || text?.match(regexp))
    return true
  return false
}

export default includeCode
