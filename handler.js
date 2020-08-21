const AWS = require('aws-sdk')
const SFN = new AWS.StepFunctions()

module.exports.sqs = async event => {
  console.log(JSON.stringify(event))

  const record = event.Records[0]
  const body = JSON.parse(record.body)

  const response = await SFN.sendTaskSuccess({
    output: "42",
    taskToken: body.Token
  }).promise()

  return response
};

module.exports.lambda = async event => {
  console.log(JSON.stringify(event))

  const response = await SFN.sendTaskSuccess({
    output: "42",
    taskToken: event.Token
  }).promise()

  return response
};

module.exports.sns = async event => {
  console.log(JSON.stringify(event))

  const record = event.Records[0]
  const message = JSON.parse(record.Sns.Message)

  const response = await SFN.sendTaskSuccess({
    output: "42",
    taskToken: message.Token
  }).promise()
  return response
};

