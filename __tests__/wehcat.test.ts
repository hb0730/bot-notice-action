import * as core from '@actions/core'
import * as index from '../src/index'

const webhook = 'xxx'

let getInputMock: jest.SpyInstance
describe('wechat robot action test', () => {
  beforeAll(() => {
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })
  it('send text simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
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
        case 'bot':
          return 'wechat'
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
  it('send markdown simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'markdown'
        case 'content':
          return `实时新增用户反馈<font color=\"warning\">132例</font>，请相关同事注意。\n
              >类型:<font color=\"comment\">用户反馈</font>
              >普通用户反馈:<font color=\"comment\">117例</font>
              >VIP用户反馈:<font color=\"comment\">15例</font>`
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send markdown', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'markdown'
        case 'content':
          return `
              markdown:
                content: '实时新增用户反馈<font color=\"warning\">132例</font>，请相关同事注意。\n
                >类型:<font color=\"comment\">用户反馈</font>\n
                >普通用户反馈:<font color=\"comment\">117例</font>\n
                >VIP用户反馈:<font color=\"comment\">15例</font>\n'
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
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'image'
        case 'content':
          return `
              base64: "DATA"
              md5: "md5"
              `
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
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'image'
        case 'content':
          return `
              image:
                base64: "DATA"
                md5: "md5"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send news simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'news'
        case 'content':
          return `
              articles:
                - title: "中秋节礼品领取"
                  description: "今年中秋节公司有豪礼相送"
                  url: "www.qq.com"
                  picurl: "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png"
              `
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send news', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'news'
        case 'content':
          return `
              news:
                articles:
                  - title: "中秋节礼品领取"
                    description: "今年中秋节公司有豪礼相送"
                    url: "www.qq.com"
                    picurl: "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send file simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'file'
        case 'content':
          return '3a8asd892asd8asd'
        case 'simplified':
          return 'true'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send file', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'file'
        case 'content':
          return `
              file:
                media_id: "3a8asd892asd8asd"
              `
        case 'simplified':
          return 'false'
        default:
          return ''
      }
    })
    await index.run()
  })
  it('send template_card simplified', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'webhook':
          return webhook
        case 'bot':
          return 'wechat'
        case 'msg_type':
          return 'template_card'
        case 'content':
          return `
              card_type: "text_notice"
              source:
                icon_url: "https://wework.qpic.cn/wwpic/252813_jOfDHtcISzuodLa_1629280209/0"
                desc: "企业微信"
                desc_color: "0"
              main_title:
                title: "欢迎使用企业微信"
                desc: "您的好友正在邀请您加入企业微信"
              emphasis_content:
                title: "100"
                desc: "数据含义"
              quote_area:
                type: 1
                url: "https://work.weixin.qq.com/?from=openApi"
                appid: "APPID"
                pagepath: "PAGEPATH"
                title: "引用文本标题"
                quote_text: "Jack：企业微信真的很好用~\nBalian：超级好的一款软件！"
              sub_title_text: "下载企业微信还能抢红包！"
              horizontal_content_list:
              - keyname: "邀请人"
                value: "张三"
              - keyname: "企微官网"
                value: "点击访问"
                type: 1
                url: "https://work.weixin.qq.com/?from=openApi"
              - keyname: "企微下载"
                value: "企业微信.apk"
                type: 2
                media_id: "MEDIAID"
              jump_list:
              - type: 1
                url: "https://work.weixin.qq.com/?from=openApi"
                title: "企业微信官网"
              - type: 2
                appid: "APPID"
                pagepath: "PAGEPATH"
                title: "跳转小程序"
              card_action:
              - type: 1
                url: "https://work.weixin.qq.com/?from=openApi"
                appid: "APPID"
                pagepath: "PAGEPATH"
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
