// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import EventBridge from "aws-sdk/clients/eventbridge"

export interface EventsSettings {
  /*
   * The event bus name in AWS to put the event to.
   */
  eventBusName: string

  /*
   * The `detail-type` in the AWS Event envelope.
   */
  detailType: string

  /*
   * The `source` for the AWS Event envelope.
   */
  source: string

  /*
   * The `detail` of the AWS Event envelope.
   */
  detail: string
}

export function eventSettingsToAWSEvent(es: EventsSettings): EventBridge.PutEventsRequest {
  return {
    Entries: [
      {
        EventBusName: es.eventBusName,
        DetailType: es.detailType,
        Source: es.source,
        Detail: es.detail,
      },
    ],
  }
}
