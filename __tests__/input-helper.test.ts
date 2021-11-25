import {describe, test, expect} from "@jest/globals"
import * as core from "@actions/core"
import * as github from "@actions/github"

import * as inputHelper from "./../src/input-helper"

import EventBridge from "aws-sdk/clients/eventbridge"

describe("input-helper tests", () => {
  beforeAll(() => {
    jest.spyOn(core, "error").mockImplementation(jest.fn())
    jest.spyOn(core, "warning").mockImplementation(jest.fn())
    jest.spyOn(core, "info").mockImplementation(jest.fn())
    jest.spyOn(core, "debug").mockImplementation(jest.fn())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("parses correctly with detail", async () => {
    const inputs: {[key: string]: string} = {
      event_bus_name: "mock",
      detail_type: "detail",
      source: "source",
      detail: '{"test": "value"}',
    }

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      return inputs[name]
    })

    const pr: EventBridge.PutEventsRequest = await inputHelper.getInputs()

    expect(pr.Entries.length).toBe(1)
    expect(pr.Entries[0].Source).toBe("source")
    expect(pr.Entries[0].EventBusName).toBe("mock")
    expect(pr.Entries[0].DetailType).toBe("detail")
    expect(pr.Entries[0].Detail).toBe('{"test": "value"}')
  })

  it("parses correctly without detail", async () => {
    const inputs: {[key: string]: string} = {
      event_bus_name: "mock",
      detail_type: "detail",
      source: "source",
      detail: "",
    }

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      return inputs[name]
    })

    github.context.payload = {test: 1}

    const pr: EventBridge.PutEventsRequest = await inputHelper.getInputs()

    expect(pr.Entries.length).toBe(1)
    expect(pr.Entries[0].Source).toBe("source")
    expect(pr.Entries[0].EventBusName).toBe("mock")
    expect(pr.Entries[0].DetailType).toBe("detail")
    expect(pr.Entries[0].Detail).toBe('{"test":1}')
  })
})
