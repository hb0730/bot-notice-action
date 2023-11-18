import CryptoJS from 'crypto-js'
import utils from './utils'
import * as http from '@actions/http-client'
import yaml from 'js-yaml'
import * as core from '@actions/core'
enum BotTypeEnum {
  feishu = 'feishu',
  dingtalk = 'dingtalk',
  wechat = 'wechat'
}
enum MsgTypeEnum {
  // supported Feishu,Wechat
  text = 'text',
  // supported: Feishu
  post = 'post',
  // supported: Feishu
  share_chat = 'share_chat',
  // supported: Feishu
  interactive = 'interactive',
  // supported: Feishu,Wechat
  image = 'image',
  // supported: Wechat
  markdown = 'markdown',
  // supported: Wechat
  news = 'news',
  // supported: Wechat
  file = 'file',
  // supported: Wechat
  template_card = 'template_card'
}
/**
 * Bot options
 */
export interface BotOptions {
  webhook: string
  secret?: string
  bot?: string
  simplified?: boolean
  msg_type: string
  content: string
}
/**
 * Bot response
 */
export interface BotResponse {
  success: boolean
  msg: string
}
/**
 * Bot interface
 */
interface Bot {
  /**
   *  发送消息
   * @param msgType  消息类型
   * @param content  消息内容
   */
  send(msgType: string, content: string): Promise<BotResponse>
  /**
   * 发送消息
   * @param msgType 消息类型
   * @param content  消息内容
   * @param simplified  内容是否已经简化，默认为false
   */
  send(
    msgType: string,
    content: string,
    simplified?: boolean
  ): Promise<BotResponse>
}
/**
 * Default bot,自动适配
 */
export class DefaultBot {
  private botOptions: BotOptions
  constructor(botOptions: BotOptions) {
    this.botOptions = botOptions
  }
  start(): Promise<BotResponse> {
    const botType = BotTypeEnum[this.botOptions.bot as keyof typeof BotTypeEnum]
    let botClient: Bot | undefined
    if (botType === BotTypeEnum.feishu) {
      core.debug('Adapting Feishu Bot')
      const feishuClient = new FeishuBot(this.botOptions.webhook)
      feishuClient.secret = this.botOptions.secret
      botClient = feishuClient
    } else if (botType === BotTypeEnum.wechat) {
      core.debug('Adapting Wechat Bot')
      const wechatClient = new WechatBot(this.botOptions.webhook)
      botClient = wechatClient
    } else {
      throw new Error(`Unsupported bot type: ${botType}`)
    }
    if (!botClient) {
      throw new Error(`Unsupported bot type: ${botType}`)
    }
    return botClient.send(
      this.botOptions.msg_type,
      this.botOptions.content,
      this.botOptions.simplified === true
    )
  }
}
/**
 * Feishu message
 */
interface FeishuMessage {
  msg_type: string
  [key: string]: any
  timestamp?: string
  sign?: string
}
/**
 * Feishu bot
 */
export class FeishuBot implements Bot {
  private webhook: string
  secret?: string
  private _client: http.HttpClient
  constructor(webhook: string) {
    this.webhook = webhook
    this._client = new http.HttpClient('bot-notice-action/1.0.0')
  }
  async send(
    msgType: string,
    content: string,
    simplified?: boolean
  ): Promise<BotResponse> {
    let _response = ''
    if (!simplified) {
      _response = await this.sendMessage(msgType, content)
    } else {
      const _msgType = MsgTypeEnum[msgType as keyof typeof MsgTypeEnum]
      if (_msgType === MsgTypeEnum.text) {
        _response = await this.sendText(content)
      } else if (_msgType === MsgTypeEnum.post) {
        _response = await this.sendPost(content)
      } else if (_msgType === MsgTypeEnum.share_chat) {
        _response = await this.sendShareChat(content)
      } else if (_msgType === MsgTypeEnum.interactive) {
        _response = await this.sendInteractive(content)
      } else if (_msgType === MsgTypeEnum.image) {
        _response = await this.sendImage(content)
      } else {
        throw new Error(`Unsupported msg type: ${_msgType}`)
      }
    }
    const {code, msg} = JSON.parse(_response)
    return {
      success: code === 0,
      msg
    }
  }
  /**
   *  发送消息
   * @param msgType  消息类型
   * @param content  消息内容,未简化的内容，支持yaml,json
   * @returns  发送响应
   */
  private async sendMessage(msgType: string, content: string): Promise<string> {
    const message: FeishuMessage = yaml.load(content) as FeishuMessage
    message.msg_type = msgType
    return await this.post(message)
  }
  /**
   *  发送文本
   * @param text 文本内容
   * @returns  发送响应
   */
  private async sendText(text: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'text',
      content: {
        text: text
      }
    }
    return await this.post(message)
  }
  /**
   * 发送富文本消息
   * @param content 富文本内容,格式内存为: {zh_cn:{},en_us:{}}
   * @returns 发送响应
   */
  private async sendPost(content: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'post',
      content: {
        post: yaml.load(content)
      }
    }
    return await this.post(message)
  }
  /**
   *  发送分享群
   * @param content 群 ID
   * @returns  发送响应
   */
  private async sendShareChat(content: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'share_chat',
      content: {
        share_chat_id: content
      }
    }
    return await this.post(message)
  }
  /**
   *  发送图片
   * @param content  图片内容,格式内存为: 'img_ecffc3b9'
   * @returns
   */
  private async sendImage(content: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'image',
      content: {
        image_key: content
      }
    }
    return await this.post(message)
  }

  /**
   *  发送消息卡片
   * @param content  消息卡片内容，格式内存为: {elements:[], header:{}}
   * @returns  发送响应
   */
  private async sendInteractive(content: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'interactive',
      card: yaml.load(content)
    }
    return await this.post(message)
  }

  private async post(message: FeishuMessage): Promise<string> {
    if (utils.exits(this.secret)) {
      const timestamp = utils.genTimeStamp10()
      message.timestamp = timestamp
      message.sign = this.genSign(timestamp)
    }
    core.debug(`send message: ${JSON.stringify(message)}`)
    const response = await this._client.post(
      this.webhook,
      JSON.stringify(message),
      {
        'Content-type': 'application/json'
      }
    )
    return response.readBody()
  }

  private genSign(timestamp: string): string {
    const key = `${timestamp}\n${this.secret}`
    const signature = CryptoJS.HmacSHA256('', key).toString(CryptoJS.enc.Base64)
    return signature
  }
}
interface WechatMessage {
  msgtype: string
  [key: string]: any
}

export class WechatBot implements Bot {
  private webhook: string
  private _client: http.HttpClient
  constructor(webhook: string) {
    this.webhook = webhook
    this._client = new http.HttpClient('bot-notice-action/1.0.0')
  }
  async send(
    msgType: string,
    content: string,
    simplified?: boolean
  ): Promise<BotResponse> {
    let _response = ''
    if (!simplified) {
      _response = await this.sendMessage(msgType, content)
    } else {
      const _msgType = MsgTypeEnum[msgType as keyof typeof MsgTypeEnum]
      if (_msgType === MsgTypeEnum.text) {
        _response = await this.sendText(content)
      } else if (_msgType === MsgTypeEnum.image) {
        _response = await this.sendImage(content)
      } else if (_msgType === MsgTypeEnum.markdown) {
        _response = await this.sendMarkdown(content)
      } else if (_msgType === MsgTypeEnum.news) {
        _response = await this.sendNews(content)
      } else if (_msgType === MsgTypeEnum.file) {
        _response = await this.sendFile(content)
      } else if (_msgType === MsgTypeEnum.template_card) {
        _response = await this.sendTemplateCard(content)
      } else {
        throw new Error(`Unsupported msg type: ${_msgType}`)
      }
    }
    const {errcode, errmsg} = JSON.parse(_response)
    return {
      success: errcode === 0,
      msg: errmsg
    }
  }
  private async sendMessage(msgType: string, content: string): Promise<string> {
    const message: WechatMessage = yaml.load(content) as WechatMessage
    message.msgtype = msgType
    return await this.post(message)
  }

  private async sendText(text: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'text',
      text: {
        content: text
      }
    }
    return await this.post(message)
  }

  private async sendMarkdown(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'markdown',
      markdown: {
        content: content
      }
    }
    return await this.post(message)
  }
  private async sendImage(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'image',
      image: yaml.load(content)
    }
    return await this.post(message)
  }
  private async sendNews(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'news',
      news: yaml.load(content)
    }
    return await this.post(message)
  }
  private async sendFile(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'file',
      file: {
        media_id: content
      }
    }
    return await this.post(message)
  }
  private async sendTemplateCard(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: 'template_card',
      template_card: yaml.load(content)
    }
    return await this.post(message)
  }
  private async post(message: WechatMessage): Promise<string> {
    core.debug(`send message: ${JSON.stringify(message)}`)
    const response = await this._client.post(
      this.webhook,
      JSON.stringify(message),
      {
        'Content-type': 'application/json'
      }
    )
    return response.readBody()
  }
}
