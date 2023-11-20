import * as core from '@actions/core'
import {
  BotOptions,
  BotType,
  BuildNotification,
  DefaultBot,
  JobStatus,
  Message,
  MsgType
} from './bot'

export async function run(): Promise<void> {
  try {
    core.info('Bot Notification Action Start ....')
    const botOptions = readBotInputs()
    const message = readMessageInputs()
    core.debug(
      `Bot Options: ${JSON.stringify(botOptions)}, Message: ${JSON.stringify(
        message
      )}`
    )
    const bot = new DefaultBot(botOptions)
    const response = await bot.start(message)
    if (!response.success) {
      throw new Error(response.msg)
    }
    core.setOutput('response', response)
    core.info('Bot Notification Action Successful ....')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

function readBotInputs(): BotOptions {
  const webhook = core.getInput('webhook', {required: true})
  const secret = core.getInput('secret')
  const bot = core.getInput('bot', {required: true})
  let _bot: BotType = BotType.FEISHU
  if (bot && bot.toLowerCase()) {
    switch (bot) {
      case BotType.FEISHU:
        _bot = BotType.FEISHU
        break
      case BotType.WECHAT:
        _bot = BotType.WECHAT
        break
      default:
        throw new Error(`unknown bot type: ${bot}`)
    }
  }
  return {
    webhook,
    secret,
    bot: _bot
  }
}
function readMessageInputs(): Message {
  const defaultMsg: Message = {
    jobStatus: JobStatus.UNKNOWN,
    onNotification: BuildNotification.ALWAYS,
    simplified: false,
    msgType: MsgType.text,
    content: '',
    failedAtAll: false
  }
  const msg = defaultMsg

  const jobStatus = core.getInput('job_status', {required: true})
  switch (jobStatus.toLowerCase()) {
    case JobStatus.SUCCESS:
      msg.jobStatus = JobStatus.SUCCESS
      break
    case JobStatus.FAILED:
      msg.jobStatus = JobStatus.FAILED
      break
    case JobStatus.CANCELLED:
      msg.jobStatus = JobStatus.CANCELLED
      break
    default:
      throw new Error(`unknown job status: ${jobStatus}`)
  }

  const onNotification = core.getInput('on_notification') || 'always'
  switch (onNotification.toLowerCase()) {
    case BuildNotification.ALWAYS:
      msg.onNotification = BuildNotification.ALWAYS
      break
    case BuildNotification.SUCCESS:
      msg.onNotification = BuildNotification.SUCCESS
      break
    case BuildNotification.FAILED:
      msg.onNotification = BuildNotification.FAILED
      break
    case BuildNotification.CANCELLED:
      msg.onNotification = BuildNotification.CANCELLED
      break
    case BuildNotification.NEVER:
      msg.onNotification = BuildNotification.NEVER
      break
    default:
      throw new Error(`unknown on notification: ${onNotification}`)
  }

  const simplified = core.getBooleanInput('simplified')
  defaultMsg.simplified = simplified

  const msgtype = core.getInput('msg_type', {required: true})
  defaultMsg.msgType = msgtype as MsgType

  const content = core.getInput('content', {required: true})
  defaultMsg.content = content

  const failedAtAll = core.getBooleanInput('on_failure_at_all')
  defaultMsg.failedAtAll = failedAtAll

  return defaultMsg
}
