import * as core from '@actions/core'
import {BotOptions, DefaultBot} from './bot'

export async function run(): Promise<void> {
  try {
    core.info('Bot Notice Action Start ....')
    const botOptions = readInputs()
    const bot = new DefaultBot(botOptions)
    const response = await bot.start()
    if (!response.success) {
      throw new Error(response.msg)
    }
    core.setOutput('response', response)
    core.info('Bot Notice Action Successful')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

function readInputs(): BotOptions {
  return {
    webhook: core.getInput('webhook', {required: true}),
    secret: core.getInput('secret'),
    bot: core.getInput('bot'),
    msg_type: core.getInput('msg_type'),
    simplified: core.getBooleanInput('simplified'),
    content: core.getInput('content')
  }
}

run()
