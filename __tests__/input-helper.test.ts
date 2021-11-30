// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import {describe, expect} from "@jest/globals"
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
      resources: "test,value",
      detail: '{"test": "value"}',
    }

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      return inputs[name]
    })

    const pr: EventBridge.PutEventsRequest = await inputHelper.getInputs()

    expect(pr.Entries.length).toBe(1)
    const entry = pr.Entries[0]

    expect(entry.Source).toBe("source")
    expect(entry.EventBusName).toBe("mock")
    expect(entry.DetailType).toBe("detail")
    expect(entry.Detail).toBe('{"test": "value"}')

    const resources = entry.Resources ?? []
    expect(resources.length).toBe(2)
    expect(resources[0]).toBe("test")
    expect(resources[1]).toBe("value")
  })

  it("parses correctly without detail", async () => {
    const inputs: {[key: string]: string} = {
      event_bus_name: "mock",
      detail_type: "detail",
      source: "source",
      detail: "",
      resources: "",
    }

    jest.spyOn(core, "getInput").mockImplementation((name: string) => {
      return inputs[name]
    })

    const payload = {
      repository: {name: "test_name", owner: {name: "owner", login: "login"}},
    }
    github.context.payload = payload

    const pr: EventBridge.PutEventsRequest = await inputHelper.getInputs()

    expect(pr.Entries.length).toBe(1)
    const entry = pr.Entries[0]

    expect(entry.Source).toBe("source")
    expect(entry.EventBusName).toBe("mock")
    expect(entry.DetailType).toBe("detail")
    expect(entry.Detail).toBe(JSON.stringify(payload))

    const resources = entry.Resources ?? []
    expect(resources.length).toBe(1)

    expect(resources[0]).toStrictEqual("owner/test_name")
  })
})
