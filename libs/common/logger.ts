/* eslint-disable no-console */
import { VERBOSE } from '../../playwright.config'

export default class Logger {
  context: string

  constructor(context: string) {
    this.context = context
  }

  log(text: string, stringify: boolean = false): void {
    let logText: string = text
    if (stringify) {
      logText = JSON.stringify(text)
    }
    console.log(`[${this.context}] ${logText}`)
  }

  debug(text: string, stringify: boolean = false): void {
    if (VERBOSE) {
      this.log(text, stringify)
    }
  }
}
