import * as core from '@actions/core'
import * as github from '@actions/github'

import EventBridge from 'aws-sdk/clients/eventbridge'

async function run(): Promise<void> {
  try {
    const eventBusName: string = core.getInput('event_bus_name')
    const detailType: string = core.getInput('detail_type')
    const source: string = core.getInput('source')

    const passedDetail: string = core.getInput('detail')
    core.info(`Supplied detail: ${passedDetail}`)
    const detail: string =
      passedDetail ?? JSON.stringify(github.context.payload)

    const eb = new EventBridge()

    const params = {
      Entries: [
        {
          EventBusName: eventBusName,
          DetailType: detailType,
          Source: source,
          Detail: detail
        }
      ]
    }
    eb.putEvents(params, (err, data) => {
      if (err) {
        core.setFailed(String(err))
        return
      }

      const failedCount = data.FailedEntryCount ?? 0

      if (failedCount === 0) {
        core.info('No message failures, exiting.')
        return
      }

      const entries = data.Entries ?? []
      for (const entryResponse of entries) {
        const errorCode = entryResponse.ErrorCode ?? 'Unknown Error Code'
        const errorMessage =
          entryResponse.ErrorMessage ?? 'Unknown Error Message'
        core.info(`Got error code ${errorCode}, with message ${errorMessage}`)
      }

      core.setFailed(`Got ${failedCount} message failures, see action logs.`)
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
