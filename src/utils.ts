/**
 *  判断是否存在
 * @param value  - 任意值
 * @returns      - 是否存在
 */
export function exits(value: any): boolean {
  return value !== undefined && value !== null
}
/**
 * 判断是否为字符串
 * @param value  - 任意值
 * @returns      - 是否为字符串
 */
export function isString(value: any): boolean {
  return typeof value === 'string'
}
/**
 * 生成10位时间戳
 * @returns {string} - 时间戳
 */
function genTimeStamp10(): string {
  const timestamp = Date.now()
  return String(timestamp).slice(0, 10)
}

export default {
  exits,
  isString,
  genTimeStamp10
}
