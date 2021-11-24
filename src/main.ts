// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import * as core from "@actions/core"
import {callPutEvents} from "./event-helper"
import {getInputs} from "./input-helper"

export async function run(): Promise<void> {
  try {
    const params = await getInputs()
    core.debug(`params: ${params}`)
    callPutEvents(params)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
