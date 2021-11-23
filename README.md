# GitHub Action Event to AWS EventBridge

> A custom github action to send messages to AWS EventBridge.

## User Guide

The goal of this action is to facilitate sending events to an AWS EventBridge
EventBus. To do so, you need to configure the event like so:

```yaml
- uses: tshauck/gh-action-event-to-aws-eventbridge@v1
  with:
    event_bus_name: 'tshauck-gh-action-event-to-aws-eventbridge'
```

`event_bus_name` is the only required parameter. The other parameters are:

| parameter | default |
| ---- | ----- |
| detail_type | `GitHub Action Event` |
| source | `gh.event` |
| detail | github.context.payload's value |

## Terms of Use

Using this action is free for open source, academic, and other
non-commercial activities.

If you're using this action as part of commercial activities, you must sponsor
development via [GitHub Sponsors](https://github.com/sponsors/tshauck) for
no-less than $1 per month or a one-time $5 payment.

If you just wanna be a Chad, send me some coin:

* BTC: `3GswUVYdLTP3L36iBMCncVuJVAbpUnorhZ`
* ETH: `0x2805409b7fd27610B072Fc0F537Da9CA9e5D45D7`
