// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import * as core from "@actions/core"
import * as github from "@actions/github"

import EventBridge from "aws-sdk/clients/eventbridge"
import {eventSettingsToAWSEvent} from "./event-settings"

/**
 * Convert the core inputs into a put event promise.
 *
 * @async
 * @returns {Promise<EventBridge.PutEventsRequest>} The SDK event settings.
 */
export async function getInputs(): Promise<EventBridge.PutEventsRequest> {
  const eventBusName: string = core.getInput("event_bus_name")
  const detailType: string = core.getInput("detail_type")
  const source: string = core.getInput("source")

  const passedDetail: string = core.getInput("detail")
  const detail: string = passedDetail === "" ? JSON.stringify(github.context.payload) : passedDetail

  const passedResources: string = core.getInput("resources")
  const resources: string[] = passedResources === "" ? [] : passedResources.split(",")

  if (resources.length === 0) {
    const fullName = github.context.payload.repository?.full_name ?? "UnknownRepo"
    resources.push(fullName)
  }

  const settings = {
    eventBusName,
    detailType,
    source,
    detail,
    resources,
  }
  core.debug(`debug input params: ${JSON.stringify(settings)}`)
  return eventSettingsToAWSEvent(settings)
}
