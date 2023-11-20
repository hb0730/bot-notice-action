import * as index from '../src/core'
const webhook = 'xxx'
let envVars: any = {
  INPUT_WEBHOOK: webhook,
  INPUT_BOT: 'wechat',
  INPUT_MSG_TYPE: 'text',
  INPUT_SIMPLIFIED: 'true',
  INPUT_CONTENT: 'Hello World',
  INPUT_JOB_STATUS: 'success',
  INPUT_ON_NOTIFICATION: 'always',
  INPUT_ON_FAILURE_AT_ALL: 'false'
}

describe('wechat action test', () => {
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
  it('send text', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'text'
    envVars.INPUT_CONTENT = `text:
    content: "Hello world"`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send text at all', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'text'
    envVars.INPUT_CONTENT = `
text:
  content: "Hello world"
  mentioned_list:
  - "\${@all\}"`
    envVars.INPUT_JOB_STATUS = 'failure'
    envVars.INPUT_ON_FAILURE_AT_ALL = 'true'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send markdown simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'markdown'
    envVars.INPUT_CONTENT = `实时新增用户反馈<font color=\"warning\">132例</font>，请相关同事注意。\n
    >类型:<font color=\"comment\">用户反馈</font>
    >普通用户反馈:<font color=\"comment\">117例</font>
    >VIP用户反馈:<font color=\"comment\">15例</font>`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
  it('send markdown', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'markdown'
    envVars.INPUT_CONTENT = `
markdown:
  content: '实时新增用户反馈<font color=\"warning\">132例</font>，请相关同事注意。\n
>类型:<font color=\"comment\">用户反馈</font>\n
>普通用户反馈:<font color=\"comment\">117例</font>\n
>VIP用户反馈:<font color=\"comment\">15例</font>\n'`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send image simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'image'
    envVars.INPUT_CONTENT = `
base64: "DATA"
md5: "md5"`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send image', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'image'
    envVars.INPUT_CONTENT = `
image:
  base64: "DATA"
  md5: "md5"
    `
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send news simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'news'
    envVars.INPUT_CONTENT = `
articles:
  - title: "中秋节礼品领取"
    description: "今年中秋节公司有豪礼相送"
    url: "www.qq.com"
    picurl: "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png"`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send news', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'news'
    envVars.INPUT_CONTENT = `
news:
  articles:
    - title: "中秋节礼品领取"
      description: "今年中秋节公司有豪礼相送"
      url: "www.qq.com"
      picurl: "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png"
    `
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send file simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'file'
    envVars.INPUT_CONTENT = `3a8asd892asd8asd`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send file', async () => {
    envVars.INPUT_SIMPLIFIED = 'false'
    envVars.INPUT_MSG_TYPE = 'file'
    envVars.INPUT_CONTENT = `
file:
  media_id: "3a8asd892asd8asd"`
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })

  it('send template_card simplified', async () => {
    envVars.INPUT_SIMPLIFIED = 'true'
    envVars.INPUT_MSG_TYPE = 'template_card'
    envVars.INPUT_CONTENT = `
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
    envVars.INPUT_JOB_STATUS = 'success'
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key]
    })
    await index.run()
  })
})
