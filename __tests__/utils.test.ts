import utils from '../src/utils'
describe('utils', () => {
  it('renderTemplate', () => {
    let value = 'hello ${name}+${age}'
    let data = {name: '张三', age: 18}
    let result = utils.renderTemplate(value, data)
    expect(result).toBe('hello 张三+18')
  })
})
