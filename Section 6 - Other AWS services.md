#### 28. SNS

```yml
service:
  name: cmp-guide-step-functions
# app and org for use with dashboard.serverless.com
#app: your-app-name
#org: your-org-name

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
            Resource: arn:aws:states:::sns:publish
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