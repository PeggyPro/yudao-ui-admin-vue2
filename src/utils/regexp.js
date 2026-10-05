/** 解析表单校验配置中的 /pattern/flags 正则表达式。 */
export function parseRegExp(pattern) {
  if (pattern instanceof RegExp) return pattern
  const match = typeof pattern === 'string' && pattern.trim().match(/^\/([\s\S]*)\/([a-z]*)$/)
  if (!match) throw new SyntaxError('正则表达式格式应为 /pattern/flags')
  return new RegExp(match[1], match[2])
}
