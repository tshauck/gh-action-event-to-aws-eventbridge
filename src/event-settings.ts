// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import EventBridge from 'aws-sdk/clients/eventbridge'

export interface EventsSettings {
  eventBusName: string

  detailType: string

  source: string

  detail: string
}

export function eventSettingsToAWSEvent(
  es: EventsSettings
): EventBridge.PutEventsRequest {
  return {
    Entries: [
      {
        EventBusName: es.eventBusName,
        DetailType: es.detailType,
        Source: es.source,
        Detail: es.detail
      }
    ]
  }
}
