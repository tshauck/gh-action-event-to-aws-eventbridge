import * as core from '@actions/core'
import * as github from '@actions/github'

import EventBridge from 'aws-sdk/clients/eventbridge'

async function run(): Promise<void> {
  try {
    const eventBusName: string = core.getInput('event_bus_name')
    const detailType: string = core.getInput('detail_type')
    const source: string = core.getInput('source')

    const eb = new EventBridge()

    const params = {
      Entries: [
        {
          EventBusName: eventBusName,
          DetailType: detailType,
          Source: source,
          Detail: JSON.stringify(github.context.payload, undefined, 2)
        }
      ]
    }
    core.info(`Putting Entries: ${JSON.stringify(params)}`)

    eb.putEvents(params, (err, data) => {
      if (err) {
        core.setFailed(String(err))
        return
      }

      const failedCount = data.FailedEntryCount ?? 0

      if (failedCount === 0) {
        return
      }

      core.info(`Got ${failedCount} failures.`)

      const entries = data.Entries ?? []
      for (const entryResponse of entries) {
        const errorCode = entryResponse.ErrorCode ?? 'Unknown Error Code'
        const errorMessage =
          entryResponse.ErrorMessage ?? 'Unknown Error Message'
        core.info(`Got error code ${errorCode}, with message ${errorMessage}`)
      }
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
