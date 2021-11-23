// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import * as core from '@actions/core'
import * as github from '@actions/github'

import EventBridge from 'aws-sdk/clients/eventbridge'
import {eventSettingsToAWSEvent} from './event-settings'

export async function getInputs(): Promise<EventBridge.PutEventsRequest> {
  const eventBusName: string = core.getInput('event_bus_name')
  const detailType: string = core.getInput('detail_type')
  const source: string = core.getInput('source')

  const passedDetail: string = core.getInput('detail')

  const detail: string =
    passedDetail === '' ? JSON.stringify(github.context.payload) : passedDetail

  const settings = {
    eventBusName,
    detailType,
    source,
    detail
  }
  return eventSettingsToAWSEvent(settings)
}
