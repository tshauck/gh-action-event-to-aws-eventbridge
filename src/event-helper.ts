// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import * as core from "@actions/core"
import * as sdk from "aws-sdk"
import EventBridge from "aws-sdk/clients/eventbridge"

export function eventCallback(err?: sdk.AWSError, data?: EventBridge.PutEventsResponse): void {
  if (err) {
    core.setFailed(String(err))
    return
  }

  const failedCount = data?.FailedEntryCount ?? 0
  if (failedCount === 0) {
    core.info("No message failures, exiting.")
    return
  }

  const entries = data?.Entries ?? []
  for (const entryResponse of entries) {
    const errorCode = entryResponse.ErrorCode ?? "Unknown Error Code"
    const errorMessage = entryResponse.ErrorMessage ?? "Unknown Error Message"
    core.info(`Got error code ${errorCode}, with message ${errorMessage}`)
  }

  core.setFailed(`Got ${failedCount} message failures, see action logs.`)
}

export function callPutEvents(params: EventBridge.PutEventsRequest): void {
  const eb = new EventBridge()
  eb.putEvents(params, eventCallback)
}
