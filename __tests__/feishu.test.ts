import * as core from '@actions/core'
import * as index from '../src/index'

const webhook = 'xxx'
const secret = 'xxx'

let getInputMock: jest.SpyInstance

describe('feishu action test', () => {
  beforeAll(() => {
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })
  it('send text simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'text'
        case 'content':
          return 'Hello world'
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send text', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'text'
        case 'content':
          return `
              text:
                content: "Hello world"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send post simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'post'
        case 'content':
          return `
                zh_cn:
                  title: "项目更新通知"
                  content:
                  - tag: "text"
                    text: "项目有更新: "
                  - tag: "a"
                    text: "请查看"
                    href: "http://www.example.com/"
                  - tag: "at"
                    user_id: "ou_18eac8********17ad4f02e8bbbb"
              `
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send post', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'post'
        case 'content':
          return `
             content:
               post:
                 zh_cn:
                   title: "项目更新通知"
                   content:
                   - tag: "text"
                     text: "项目有更新: "
                   - tag: "a"
                     text: "请查看"
                     href: "http://www.example.com/"
                   - tag: "at"
                     user_id: "ou_18eac8********17ad4f02e8bbbb"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send share_chat simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'share_chat'
        case 'content':
          return 'oc_f5b1a7eb27ae2****339ff'
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send share_chat', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'share_chat'
        case 'content':
          return `
              content:
                share_chat_id: "oc_f5b1a7eb27ae2****339ff"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send image simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'image'
        case 'content':
          return `img_ecffc3b9-8f14-400f-a014-05eca1a4310g`
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send image', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'image'
        case 'content':
          return `
              content:
                image:
                  image_key: "img_ecffc3b9-8f14-400f-a014-05eca1a4310g"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send interactive simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'secret':
          return secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'interactive'
        case 'content':
          return `
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
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
})
