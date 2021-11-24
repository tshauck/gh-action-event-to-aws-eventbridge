// (c) Copyright 2021 Trent Hauck
// All Rights Reserved

import * as core from "@actions/core"
import * as sdk from "aws-sdk"

import {eventCallback} from "../src/event-helper"

describe("test event callback", () => {
  beforeAll(() => {
    jest.spyOn(core, "error").mockImplementation(jest.fn())
    jest.spyOn(core, "warning").mockImplementation(jest.fn())
    jest.spyOn(core, "info").mockImplementation(jest.fn())
    jest.spyOn(core, "debug").mockImplementation(jest.fn())
  })

  it("exits when passing an error", async () => {
    const failCall = jest.fn()
    jest.spyOn(core, "setFailed").mockImplementation(failCall)

    const err: sdk.AWSError = {
      name: "error",
      code: "error",
      message: "error",
      time: new Date(),
    }

    const data = {}
    eventCallback(err, data)

    expect(failCall.mock.calls.length).toBe(1)
  })

  it("exits when early with no failures", async () => {
    const infoCall = jest.fn()
    jest.spyOn(core, "info").mockImplementation(infoCall)

    const failCall = jest.fn()
    jest.spyOn(core, "setFailed").mockImplementation(failCall)

    const data = {
      FailedEntryCount: 0,
    }
    const err = undefined
    eventCallback(err, data)

    expect(infoCall.mock.calls.length).toBe(1)
    expect(failCall.mock.calls.length).toBe(0)
  })

  it("shows failure info when supplied", async () => {
    const infoCall = jest.fn()
    jest.spyOn(core, "info").mockImplementation(infoCall)

    const failCall = jest.fn()
    jest.spyOn(core, "setFailed").mockImplementation(failCall)

    const data = {
      FailedEntryCount: 1,
      Entries: [
        {
          ErrorCode: "error",
          ErrorMessage: "errorMessage",
        },
      ],
    }
    const err = undefined
    eventCallback(err, data)

    expect(infoCall.mock.calls.length).toBe(1)
    expect(failCall.mock.calls.length).toBe(1)
  })
})
