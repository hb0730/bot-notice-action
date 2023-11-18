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
  text = 'text'
}
/**
 * Bot options
 */
export interface BotOptions {
  webhook: string
  secret?: string
  bot?: string
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
  send(msgType: string, content: string): Promise<BotResponse>
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
    } else {
      throw new Error(`Unsupported bot type: ${botType}`)
    }
    if (!botClient) {
      throw new Error(`Unsupported bot type: ${botType}`)
    }
    return botClient.send(this.botOptions.msg_type, this.botOptions.content)
  }
}
/**
 * Feishu message
 */
interface FeishuMessage {
  msg_type: string
  content: any
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
  /**
   *  Send message
   * @param msgType message type
   * @param content  message content, can be json or yaml
   * @returns response
   */
  async send(msgType: string, content: string): Promise<BotResponse> {
    const _msgType = MsgTypeEnum[msgType as keyof typeof MsgTypeEnum]
    let _response = ''
    if (_msgType === MsgTypeEnum.text) {
      _response = await this.sendText(content)
    } else {
      _response = await this.post({
        msg_type: msgType,
        content: yaml.load(content)
      })
    }
    const {code, msg} = JSON.parse(_response)
    return {
      success: code === 0,
      msg
    }
  }
  private async sendText(text: string): Promise<string> {
    const message: FeishuMessage = {
      msg_type: 'text',
      content: {
        text
      }
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
