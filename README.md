# GitHub Action Event to AWS EventBridge

> A custom github action to send messages to AWS EventBridge.

<!-- vim-markdown-toc GFM -->

* [Terms of Use](#terms-of-use)
  * [Payment via Stripe](#payment-via-stripe)
  * [Sending BTC/ETH](#sending-btceth)
* [User Guide](#user-guide)
  * [GitHub Actions](#github-actions)
  * [AWS](#aws)
    * [Permissions](#permissions)

<!-- vim-markdown-toc -->

## Terms of Use

Using this action is free for open source, academic, and other non-commercial activities.

If you'd like to use this action for commercial activities, you must do one of
the following:

* make a code or documentation contribution to the repo
* pay an invoice via Stripe
* have a provable BTC/ETH transfer.

### Payment via Stripe

If you'd like to purchase via Stripe, either make a one-time payment of
$10 or subscribe for $1/month.

* [One Time](https://buy.stripe.com/aEU03s4nM7Y876wbIJ)
* [Recurring](https://buy.stripe.com/cN217w3jI5Q01Mc4gg)

### Sending BTC/ETH

You are also granted usage rights if you can prove a transfer of at least 0.0025
ETH or at least 0.00025 BTC, see the following QR codes for the respective wallets:

|Token|Amount|Address |QR Code|
| --- | ----|---- | ----- |
|ETH| 0.00250 ETH | `0xd25eace6c5b1cFfAD0d771EeE9E68a7E69CE534f` | ![ETH](./.github/crypto-qr/eth.png) |
|BTC| 0.00025 BTC | `37TWrgEiThdbkngZAtptWdK1hZ7ySD1BDA` | ![BTC](./.github/crypto-qr/btc.png) |

## User Guide

This section provides guidance on how to configure the GitHub Action and AWS
EventBridge Bus/Rule/etc.

### GitHub Actions

The goal of this action is to facilitate sending events to an AWS EventBridge
EventBus. To do so, you need to configure the action like so:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@master
  with:
    role-to-assume: ${{ secrets.ROLE }}  # needs permissions to write to the event bus
- uses: tshauck/gh-action-event-to-aws-eventbridge@main  # see the releases for tags
  with:
    event_bus_name: 'tshauck-gh-action-event-to-aws-eventbridge'
```

`event_bus_name` is the only required parameter. Generally, your options are:

| parameter | default |
| ---- | ----- |
| event_bus_name | |
| detail_type | `GitHub Action Event` |
| source | `gh.event` |
| detail | github.context.payload's value |

For more information see:

* [GitHub Repo Events](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows)
* [EventBridge Homepage](https://docs.aws.amazon.com/eventbridge/)

### AWS

To use this event in AWS-land, setup a Rule associated with the Event Bus, and
then a Target for that Rule. For example, this is a snippet of a Rule that
targets an API Destination to make a GitHub Issue.

```yaml
Resources:
  EventBus:
    Type: AWS::Events::EventBus
    Properties:
      Name: my-event-bus

  GitHubConnection: # Full definition omitted.
    Type: AWS::Events::Connection

  GitHubApiDestination:
    Type: AWS::Events::ApiDestination
    Properties:
      Name: "GitHubApiDestination"
      ConnectionArn: !GetAtt GitHubConnection.Arn
      InvocationEndpoint: https://api.github.com/repos/my/repo/issues
      HttpMethod: POST
      InvocationRateLimitPerSecond: 10

  EventBusRule:
    Type: AWS::Events::Rule
    Properties:
      EventBusName: !Ref EventBus
      RoleArn: !GetAtt APIRole.Arn  # defined elsewhere
      EventPattern:
        detail-type:
          - "GitHub Action Event"
      Targets:
        - Arn: !GetAtt GitHubApiDestination.Arn
          RoleArn: !GetAtt APIRole.Arn  # defined elsewhere
          Id: "GithubAPIDestination"
          InputTransformer:
            InputPathsMap:
              head_commit_url: $.detail.head_commit.url
              repo_name: $.detail.repository.name
            InputTemplate: '{"title": "Got build event for <repo_name>", "body": "<head_commit_url> fired this event."}'
```

#### Permissions

The role associated with your authentication mechanism from the Action to AWS
needs to be able to put events to the bus in question. It's recommended you use
AWS's action [here](https://github.com/aws-actions/configure-aws-credentials).
