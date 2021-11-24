# GitHub Action Event to AWS EventBridge

> A custom github action to send messages to AWS EventBridge.

<!-- vim-markdown-toc GFM -->

* [User Guide](#user-guide)
  * [AWS Permissions](#aws-permissions)
* [Terms of Use](#terms-of-use)
  * [Payment via Stripe](#payment-via-stripe)
  * [Sending BTC/ETH](#sending-btceth)

<!-- vim-markdown-toc -->

## User Guide

The goal of this action is to facilitate sending events to an AWS EventBridge
EventBus. To do so, you need to configure the event like so:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@master
  with:
    role-to-assume: ${{ secrets.ROLE }}  # needs permissions to write to the event bus
- uses: tshauck/gh-action-event-to-aws-eventbridge@v0.1.0
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

### AWS Permissions

The role associated with your authentication mechanism needs to be able to
put events to the bus in question. It's recommended you use AWS's action
[here](https://github.com/aws-actions/configure-aws-credentials).

For example of this in action, see the `merge.yml` workflow in this repo.

## Terms of Use

Using this action is free for open source, academic, and other non-commercial activities.

If you'd like to use this action for commercial activities, you must either
pay an invoice or have a provable BTC/ETH transfer.

### Payment via Stripe

If you'd like to purchase via Stripe, either make a one-time payment of
$10 or subscribe for $1/month.

* [One Time](https://buy.stripe.com/aEU03s4nM7Y876wbIJ)
* [Recurring](https://buy.stripe.com/cN217w3jI5Q01Mc4gg)

### Sending BTC/ETH

You are also granted usage rights if you can prove a transfer of at least 0.0025
ETH or at least 0.00025 BTC, see the following QR codes for the respective wallets:

|Token|Amount|QR Code| Address |
| --- | ----|---- | ----- |
|ETH| 0.00250 ETH | ![ETH](./.github/crypto-qr/eth.png) | ```0xd25eace6c5b1cFfAD0d771EeE9E68a7E69CE534f``` |
|BTC| 0.00025 BTC | ![BTC](./.github/crypto-qr/btc.png) | ```37TWrgEiThdbkngZAtptWdK1hZ7ySD1BDA``` |
