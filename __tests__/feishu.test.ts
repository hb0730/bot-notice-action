import * as index from '../src/core'

const webhook = 'xxx'
const secret = 'xxx'
let envVars: any = {
  INPUT_WEBHOOK: webhook,
  INPUT_SECRET: secret,
  INPUT_BOT: 'feishu',
  INPUT_MSG_TYPE: 'text',
  INPUT_SIMPLIFIED: 'true',
  INPUT_CONTENT: 'Hello World',
  INPUT_JOB_STATUS: 'success',
  INPUT_ON_NOTIFICATION: 'always',
  INPUT_ON_FAILURE_AT_ALL: 'false'
}

describe('feishu action test', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })
  it('send text simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'text'
    envVars.INPUT_CONTENT = 'Hello World'
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send text simplified at all', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'text'
    envVars.INPUT_CONTENT = 'Hello World ${@all}'
    envVars.INPUT_JOB_STATUS = 'failure'
    envVars.INPUT_ON_FAILURE_AT_ALL = 'true'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send text', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'text'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
    text:
      content: "Hello world"`
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send post simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'post'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
    zh_cn:
      title: "项目更新通知"
      content:
      - - tag: "text"
          text: "项目有更新: "
        - tag: "a"
          text: "请查看"
          href: "http://www.example.com/"
        - tag: "at"
          user_id: "ou_18eac8********17ad4f02e8bbbb"
       `
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send post', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'post'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
    content:
      post:
        zh_cn:
          title: "项目更新通知"
          content:
          - - tag: "text"
              text: "项目有更新: "
            - tag: "a"
              text: "请查看"
              href: "http://www.example.com/"
            - tag: "at"
              user_id: "ou_18eac8********17ad4f02e8bbbb"
       `
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send share_chat simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'share_chat'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `oc_f5b1a7eb27ae2****339ff`
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send share_chat', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'share_chat'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
    content:
      share_chat_id: "oc_f5b1a7eb27ae2****339ff"
    `
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send image simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'image'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = 'img_ecffc3b9-8f14-400f-a014-05eca1a4310g'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send image', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'image'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
    content:
      image:
        image_key: "img_ecffc3b9-8f14-400f-a014-05eca1a4310g"
    `
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send interactive simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'interactive'
    envVars.INPUT_JOB_STATUS = 'success'
    envVars.INPUT_CONTENT = `
elements:
- tag: "div"
  text:
    content: "**西湖**，位于浙江省杭州市西湖区龙井路1号，杭州市区西部，景区总面积49平方千米，汇水面积为21.22平方千米，湖面面积为6.38平方千米。"
    tag: "lark_md"
- actions:
  - tag: "button"
    text: 
      content: "更多景点介绍 :玫瑰:"
      tag: "lark_md"
    url: "https://www.example.com"
    type: "default"
    value: 
  tag: "action"
header:
  title:
    content: "今日旅游推荐"
    tag: "plain_text"
    `
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
})
