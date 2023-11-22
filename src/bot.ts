import * as core from '@actions/core'
import * as http from '@actions/http-client'
import yaml from 'js-yaml'
import CryptoJS from 'crypto-js'
import utils from './utils'

export enum JobStatus {
  SUCCESS = 'success',
  FAILED = 'failure',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown'
}
export enum BuildNotification {
  ALWAYS = 'always',
  SUCCESS = 'success',
  FAILED = 'failure',
  CANCELLED = 'cancelled',
  NEVER = 'never'
}
export enum BotType {
  WECHAT = 'wechat',
  FEISHU = 'feishu',
  DINGTALK = 'dingtalk'
}
export enum MsgType {
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
 * bot options
 */
export interface BotOptions {
  /**
   * bot webhook
   */
  webhook: string
  /**
   * bot secret
   */
  secret?: string
  /**
   * bot type
   */
  bot: BotType
}
export interface Message extends JobOptions {
  /**
   * content is simplified
   */
  simplified: boolean
  /**
   * msg type
   */
  msgType: MsgType
  /**
   * content
   */
  content: string
  /**
   * build failed at all
   */
  failedAtAll: boolean
}
export interface JobOptions {
  /**
   * job status
   */
  jobStatus: JobStatus
  /**
   * build notification
   */
  onNotification: BuildNotification
}
/**
 * Bot response
 */
export interface BotResponse {
  success: boolean
  msg: string
}

export interface Bot {
  /**
   * send message
   * @param message
   */
  send(message: Message): Promise<BotResponse>
}

export class DefaultBot {
  private options: BotOptions
  constructor(options: BotOptions) {
    this.options = options
  }

  start(message: Message): Promise<BotResponse> {
    let botClient: Bot
    switch (this.options.bot) {
      case BotType.WECHAT:
        core.debug(`Adapting to WechatBot`)
        botClient = new WechatBot(this.options)
        break
      case BotType.FEISHU:
        core.debug(`Adapting to FeishuBot`)
        botClient = new FeishuBot(this.options)
        break
      default:
        throw new Error(`unknown bot type: ${this.options.bot}`)
    }
    if (!botClient) {
      throw new Error(`unknown bot type: ${this.options.bot}`)
    }
    switch (message.onNotification) {
      case BuildNotification.ALWAYS:
        return botClient.send(message)
      case BuildNotification.SUCCESS:
        if (message.jobStatus === JobStatus.SUCCESS) {
          return botClient.send(message)
        }
      case BuildNotification.FAILED:
        if (message.jobStatus === JobStatus.FAILED) {
          return botClient.send(message)
        }
      case BuildNotification.CANCELLED:
        if (message.jobStatus === JobStatus.CANCELLED) {
          return botClient.send(message)
        }
      case BuildNotification.NEVER:
      default:
        core.debug(
          `skip sending message, onNotification: ${message.onNotification}, jobStatus: ${message.jobStatus}`
        )
        return Promise.resolve({
          success: true,
          msg: 'success'
        })
    }
  }
}

interface FeishuMessage {
  msg_type: MsgType
  timestamp?: string
  sign?: string
  [key: string]: any
}
class FeishuBot implements Bot {
  private options: BotOptions
  private client: http.HttpClient
  constructor(options: BotOptions) {
    this.options = options
    this.client = new http.HttpClient()
  }
  async send(message: Message): Promise<BotResponse> {
    let content = message.content
    if (!content) {
      throw new Error('content is empty')
    }
    // 失败时at所有人
    if (message.failedAtAll && message.jobStatus === JobStatus.FAILED) {
      let at_all = ``
      switch (message.msgType) {
        case MsgType.text:
          at_all = `<at user_id="all">所有人</at> `
          break
        case MsgType.interactive:
          at_all = `<at id=all></at>`
          break
        default:
          break
      }
      if (at_all) {
        content = utils.renderTemplate(content, {'@all': at_all})
      }
    }
    // 成功时取消at所有人
    if (message.failedAtAll && message.jobStatus === JobStatus.SUCCESS) {
      content = utils.renderTemplate(content, {'@all': ''})
    }

    let _response = ''
    // 非简化的内容
    if (!message.simplified) {
      _response = await this.sendMessage(message.msgType, content)
    } else {
      switch (message.msgType) {
        case MsgType.text:
          _response = await this.sendText(content)
          break
        case MsgType.post:
          _response = await this.sendPost(content)
          break
        case MsgType.share_chat:
          _response = await this.sendShareChat(content)
          break
        case MsgType.image:
          _response = await this.sendImage(content)
          break
        case MsgType.interactive:
          _response = await this.sendInteractive(content)
          break
        default:
          throw new Error(`unsupport message type: ${message.msgType}`)
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
  private async sendMessage(
    msgType: MsgType,
    content: string
  ): Promise<string> {
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
      msg_type: MsgType.text,
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
      msg_type: MsgType.post,
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
      msg_type: MsgType.share_chat,
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
      msg_type: MsgType.image,
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
      msg_type: MsgType.interactive,
      card: yaml.load(content)
    }
    return await this.post(message)
  }
  private async post(message: FeishuMessage): Promise<string> {
    if (utils.exits(this.options.secret)) {
      const timestamp = utils.genTimeStamp10()
      message.timestamp = timestamp
      message.sign = this.genSign(timestamp)
    }
    core.debug(`send message: ${JSON.stringify(message)}`)
    const response = await this.client.post(
      this.options.webhook,
      JSON.stringify(message),
      {
        'Content-Type': 'application/json'
      }
    )
    return response.readBody()
  }
  private genSign(timestamp: string): string {
    const key = `${timestamp}\n${this.options.secret}`
    const signature = CryptoJS.HmacSHA256('', key).toString(CryptoJS.enc.Base64)
    return signature
  }
}
interface WechatMessage {
  msgtype: MsgType
  [key: string]: any
}
class WechatBot implements Bot {
  private options: BotOptions
  private client: http.HttpClient
  constructor(options: BotOptions) {
    this.options = options
    this.client = new http.HttpClient()
  }
  async send(message: Message): Promise<BotResponse> {
    let content = message.content
    if (message.failedAtAll && message.jobStatus === JobStatus.FAILED) {
      let at_all = ''
      switch (message.msgType) {
        case MsgType.text:
          at_all = '@all'
          break
        default:
          break
      }
      if (at_all) {
        content = utils.renderTemplate(content, {'@all': at_all})
      }
    }
    // 成功时取消at所有人
    if (message.failedAtAll && message.jobStatus === JobStatus.SUCCESS) {
      content = utils.renderTemplate(content, {'@all': ''})
    }

    let _response = ''
    if (!message.simplified) {
      _response = await this.sendMessage(message.msgType, content)
    } else {
      switch (message.msgType) {
        case MsgType.text:
          _response = await this.sendText(content)
          break
        case MsgType.markdown:
          _response = await this.sendMarkdown(content)
          break
        case MsgType.image:
          _response = await this.sendImage(content)
          break
        case MsgType.news:
          _response = await this.sendNews(content)
          break
        case MsgType.file:
          _response = await this.sendFile(content)
          break
        case MsgType.template_card:
          _response = await this.sendTemplateCard(content)
          break
        default:
          throw new Error(`unsupport message type: ${message.msgType}`)
      }
    }
    const {errcode, errmsg} = JSON.parse(_response)
    return {
      success: errcode === 0,
      msg: errmsg
    }
  }
  private async sendMessage(
    msgType: MsgType,
    content: string
  ): Promise<string> {
    const message: WechatMessage = yaml.load(content) as WechatMessage
    message.msgtype = msgType
    return await this.post(message)
  }
  private async sendText(text: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.text,
      text: {
        content: text
      }
    }
    return await this.post(message)
  }
  private async sendMarkdown(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.markdown,
      markdown: {
        content: content
      }
    }
    return await this.post(message)
  }
  private async sendImage(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.image,
      image: yaml.load(content)
    }
    return await this.post(message)
  }
  private async sendNews(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.news,
      news: yaml.load(content)
    }
    return await this.post(message)
  }
  private async sendFile(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.file,
      file: {
        media_id: content
      }
    }
    return await this.post(message)
  }
  private async sendTemplateCard(content: string): Promise<string> {
    const message: WechatMessage = {
      msgtype: MsgType.template_card,
      template_card: yaml.load(content)
    }
    return await this.post(message)
  }
  private async post(message: WechatMessage): Promise<string> {
    core.debug(`send message: ${JSON.stringify(message)}`)
    const response = await this.client.post(
      this.options.webhook,
      JSON.stringify(message),
      {
        'Content-Type': 'application/json'
      }
    )
    return response.readBody()
  }
}
