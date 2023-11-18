## ✨ Example Usage

- text

```yml
- name: text message
  uses: hb0730/bot-notice-action
  with:
    webhook: ${{ secrets.FEISHU_WEBHOOK }}
    secret: ${{ secrets.FEISHU_SECRET }}
    msg_type: text
    bot: 'feishu'
    content: |
      hahahah
      from github action test
      repository: ${{ github.repository }}
      committer: ${{ github.actor }}
      compare: ${{ github.event.compare }}
      job status: ${{ job.status }}
```

- post

```yml
- name: post message
  uses: hb0730/bot-notice-action
  with:
    webhook: ${{ secrets.FEISHU_WEBHOOK }}
    secret: ${{ secrets.FEISHU_SECRET }}
    msg_type: post
    bot: 'feishu'
    content: |
      post:
        zh_cn:
          title: 我是一个标题
          content:
          - - tag: text
              un_escape: true
              text: '第一行&nbsp;:'
            - tag: a
              text: 超链接
              href: http://www.feishu.cn
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
```

- share_chat

```yml
- name: share_chat message
  uses: hb0730/bot-notice-action
  with:
    webhook: ${{ secrets.FEISHU_WEBHOOK }}
    secret: ${{ secrets.FEISHU_SECRET }}
    msg_type: share_chat
    bot: 'feishu'
    content: |
      share_chat_id: oc_f5b1a7eb27ae2c7b6adc2a74faf339ff
```

- image

```yml
- name: image message
  uses: hb0730/bot-notice-action
  with:
    webhook: ${{ secrets.FEISHU_WEBHOOK }}
    secret: ${{ secrets.FEISHU_SECRET }}
    msg_type: image
    bot: 'feishu'
    content: |
      image_key: img_ecffc3b9-8f14-400f-a014-05eca1a4310g
```

```yaml
- name: interactive message
  uses: hb0730/bot-notice-action
  with:
    webhook: ${{ secrets.FEISHU_WEBHOOK }}
    secret: ${{ secrets.FEISHU_SECRET }}
    msg_type: interactive
    bot: 'feishu'
    content: |
      elements:
        - tag: markdown
          content: |
            #### 构建信息
            > - 应用名称:  ${{ github.repository }}
        header:
          title:
            content: '构建信息'
            tag: plain_text
```

🔐 Set your secrets here: `https://github.com/USERNAME/REPO/settings/secrets`.

Contexts and expression syntax for GitHub Actions, here: <https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#github-context>

**Result**

## Options

| option   | type   | description                                    |
| -------- | ------ | ---------------------------------------------- |
| bot      | string | bot type,feishu,dingtalk,wechat,default feishu |
| webhook  | string | bot webhook                                    |
| secret   | string | bot secret                                     |
| msg_type | string | message type                                   |
| content  | string | message content , yaml string                  |

## bot type

- [x] [feishu](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)

- [ ] [dingtalk](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq)
- [ ] [wechat](https://work.weixin.qq.com/api/doc/90000/90136/91770)

## message type

### feishu

- [x] text
- [x] post
- [x] share_chat
- [x] image
- [x] interactive

> [How do I use a robot in a group chat?](https://getfeishu.cn/hc/zh-cn/articles/360024984973-%E5%9C%A8%E7%BE%A4%E8%81%8A%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA)
