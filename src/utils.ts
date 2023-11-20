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
/**
 *  渲染模板，替换变量
 * @param value 内容,如"hello ${name}+${age}"
 * @param data 模板变量,{name: "张三", age: 18}
 * @returns 替换后的内容
 */
function renderTemplate(value: string, data: any) {
  const keys = Object.keys(data)
  const dataList = keys.map(function (key) {
    return data[key]
  })
  for (var i = 0; i < keys.length; i++) {
    value = value.replace(
      new RegExp('\\$\\{' + keys[i] + '\\}', 'gm'),
      dataList[i]
    )
  }
  return value
}

export default {
  exits,
  isString,
  genTimeStamp10,
  renderTemplate
}
