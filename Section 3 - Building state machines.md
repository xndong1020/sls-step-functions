#### 13. Serverless framework and Step Functions

1. init serverless project

```
sls create -t aws-nodejs-typescript
npm init -y
```

2. install `serverless-step-functions` plugin

```
npm install --save-dev serverless-step-functions
```

Add the plugin to your serverless.yml file

```yml
plugins:
  - serverless-step-functions
```

A simple sls step function:

```yml
service:
  name: cmp-guide-step-functions
# app and org for use with dashboard.serverless.com
#app: your-app-name
#org: your-org-name

custom:
  webpack:
    webpackConfig: ./webpack.config.js
    includeModules: true

# Add the serverless-webpack plugin
plugins:
  - serverless-webpack
  - serverless-step-functions

provider:
  name: aws
  runtime: nodejs12.x
  apiGateway:
    minimumCompressionSize: 1024 # Enable gzip compression for responses > 1 KB
  environment:
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello

stepFunctions:
  stateMachines:
    myStateMachine:
      name: myStateMachine
      definition:
        Comment: my first state machine
        StartAt: SayHello
        States:
          SayHello:
            Type:Task
            Resource:
              Fn::GetAtt: [hello, Arn]
            End: true

```

And handler.ts

```ts
import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

export const hello: APIGatewayProxyHandler = async ({ name }) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello ${name}`,
      },
      null,
      2
    ),
  };
};
```
