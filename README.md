## ✨ Example Usage By Simplified Content

more example see tests

- text

```yaml
# feishu
uses: hb0730/bot-notice-action
with:
  job_status: ${{job.status}}
  on_notification: 'always'
  on_failure_at_all: true
  webhook: ${{ secrets.FEISHU_WEBHOOK }}
  secret: ${{ secrets.FEISHU_SECRET }}
  bot: feishu
  msg_type: text
  simplified: true
  content: 'Hello World ${@all}'
# wechat
uses: hb0730/bot-notice-action
with:
  job_status: ${{job.status}}
  on_notification: 'always'
  on_failure_at_all: true
  simplified: false
  webhook: ${{ secrets.WECHAT_WEBHOOK }}
  bot: wechat
  msg_type: text
  simplified: true
  content: |
    text:
      content: "Hello world"
      mentioned_list:
      - "\${@all\}"`
```

🔐 Set your secrets here: `https://github.com/USERNAME/REPO/settings/secrets`.

Contexts and expression syntax for GitHub Actions, here: <https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#github-context>

**Result**

## Options

| option            | type    | description                                                                                   |
| ----------------- | ------- | --------------------------------------------------------------------------------------------- |
| job_status        | string  | Actions build status (e.g. success, failure, cancelled)                                       |
| bot               | string  | bot type,feishu,dingtalk,wechat,default feishu                                                |
| simplified        | boolean | simplified content,default true                                                               |
| webhook           | string  | bot webhook                                                                                   |
| secret            | string  | bot secret                                                                                    |
| msg_type          | string  | message type                                                                                  |
| content           | string  | message content , yaml string                                                                 |
| on_notification   | boolean | when to notify, default: always, "always", "success", "failure", "cancelled",default 'always' |
| on_failure_at_all | boolean | on failure at all,default true,template string ${@all} will be replaced                       |

## bot type

- [x] [feishu](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)

- [ ] [dingtalk](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)
- [x] [wechat](https://work.weixin.qq.com/api/doc/90000/90136/91770)

## message type

### feishu

- [x] text
- [x] post
- [x] share_chat
- [x] image
- [x] interactive

### wechat

- [x] text
- [x] markdown
- [x] image
- [x] news
- [x] file
- [x] template_card

> [How do I use a robot in a group chat?](https://getfeishu.cn/hc/zh-cn/articles/360024984973-%E5%9C%A8%E7%BE%A4%E8%81%8A%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA)
