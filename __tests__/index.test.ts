import * as index from '../src/index'
import * as core from '@actions/core'
const botOptions = {
  webhook: 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxx',
  secret: 'xxxxxx',
  bot: 'feishu',
  text_content: 'hello world',
  post_content: `
    post:
              zh_cn:
                title: 我是一个标题
                content:
                - - tag: text
                    un_escape: true
                    text: '第一行&nbsp;:'
                  - tag: a
                    text: 超链接 repo
                    href: ccc
                  - tag: at
                    user_id: ou_18eac85d35a26f989317ad4f02e8bbbb
                - - tag: text
                    text: '第二行 :'
                  - tag: text
                    text: 文本测试
                - - tag: img
                    image_key: d640eeea-4d2f-4cb3-88d8-c964fab53987
                    width: 300
                    height: 300
    `
}
const runMock = jest.spyOn(index, 'run')

let getInputMock: jest.SpyInstance

describe('feishu actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  it('feishu bot msg_type: text', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return botOptions.webhook
        case 'secret':
          return botOptions.secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'text'
        case 'content':
          return botOptions.text_content
        default:
          return ''
      }
    })
    await index.run()
    expect(runMock).toHaveReturned()
  })
  it('feishu bot msg_type: json', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return botOptions.webhook
        case 'secret':
          return botOptions.secret
        case 'bot':
          return 'feishu'
        case 'msg_type':
          return 'post'
        case 'content':
          return botOptions.post_content
        default:
          return ''
      }
    })
    await index.run()
    expect(runMock).toHaveReturned()
  })
})
