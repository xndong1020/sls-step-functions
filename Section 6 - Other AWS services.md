#### 28. SNS

```yml
service:
  name: cmp-guide-step-functions

custom:
  webpack:
    webpackConfig: ./webpack.config.js
    includeModules: 
      forceExclude:
        - aws-sdk

# Add the serverless-webpack plugin
plugins:
  - serverless-webpack
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'ap-southeast-2'}
  apiGateway:
    minimumCompressionSize: 1024 # Enable gzip compression for responses > 1 KB
  environment:
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1

functions:
  add:
    handler: handler.add

  double:
    handler: handler.double

  doubleBigNumber:
    handler: handler.doubleBigNumber

stepFunctions:
  stateMachines:
    mathStateMachine:
      name: mathStateMachine
      definition:
        Comment: my math state machine
        StartAt: SNSPublish
        States:
          SNSPublish:
            Type: Task
            Resource: arn:aws:states:::sqs:publish
            Parameters:
              Message.$: $ # take input object, and pass it to messge context
              TopicArn:
                Ref: AlarmTopic
            End: true


resources:
  Resources:
    AlarmTopic:
      Type: AWS::SNS::Topic
      Properties:
        DisplayName: my-topic
        TopicName: my-topic
```

Above code will create a topic `my-topic` in SNS, when you reference it, use `Ref: AlarmTopic` 


#### 29. SQS
Similar with SNS, but with different paramters, also resource type is differnt

```js
service:
  name: cmp-guide-step-functions

plugins:
  - serverless-webpack
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'ap-southeast-2'}
  apiGateway:
    minimumCompressionSize: 1024 # Enable gzip compression for responses > 1 KB
  environment:
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1

functions:
  handleSQS:
    handler: handler.handleSQS

stepFunctions:
  stateMachines:
    mathStateMachine:
      name: mathStateMachine
      definition:
        Comment: my math state machine
        StartAt: SQSSendMessage
        States:
          SQSSendMessage:
            Type: Task
            Resource: arn:aws:states:::sqs:sendMessage
            Parameters:
              QueueUrl: 
                Ref: MyQueue
              MessageBody.$: $ # take input object, and pass it to messge context
            Next: HandleSQS
          HandleSQS:
            Type: Task
            Resource: 
              Fn::GetAtt: ['handleSQS', 'Arn']
            End: true


resources:
  Resources:
    MyQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: my-queue
```

This time, message will be polled from lambda function `HandleSQS`, and the queue type created will be 'standard'

Note:
in `SNS` Parameters has a requried field o `Message`, whereas for `SQS` Parameters has a requried field of `MessageBody`

