#### 13. Serverless framework and Step Functions

1. init serverless project

```
sls create -t aws-nodejs-typescript
npm i
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
      name: myStateMachine # name of the state machine
      definition:
        Comment: my first state machine
        StartAt: SayHello
        States:
          SayHello:
            Type: Task
            Resource:
              Fn::GetAtt: [hello, Arn]
            End: true
```

And handler.ts

```ts
import "source-map-support/register";

interface Data {
  name: string;
}

export const hello = async ({ name }: Data) => {
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

![sayHello](./docs/img/006.png)


#### 14. Chaining function calls

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

stepFunctions:
  stateMachines:
    mathStateMachine:
      name: mathStateMachine
      definition:
        Comment: my math state machine
        StartAt: Add
        States:
          Add:
            Type: Task
            Resource:
              Fn::GetAtt: [add, Arn]
            ResultPath: $.n
            Next: Double
          Double:
            Type: Task
            Resource:
              Fn::GetAtt: [double, Arn]
            InputPath: $.n
            End: true

```

Note here, `ResultPath: $.n` and `InputPath: $.n` are all optional. 
- Without `ResultPath: $.n`, the result of `add` will be saved to root of $, and $.x and $.y will be lost
- `InputPath: $.n` if it is specified, then the input for `double` will be a number, which is 55. If it is NOT specified, then the input will be {"x": 42, "y":13, "n": 55}

handle.ts

```ts
import "source-map-support/register";

interface Data {
  x: number;
  y: number;
  n: number | null;
}

export const add = async ({ x, y }: Data): Promise<number> => {
  return x + y // if we specified ResultPath, then the result will be saved into ResultPath
};

export const double = async (n: number): Promise<number> => {
  return n * 2
};

```

#### 15. Retry

We add some code to intenionally fail the execution

```ts
import "source-map-support/register";

interface Data {
  x: number;
  y: number;
  n: number | null;
}

class NumberIsTooBigError extends Error {
  constructor(n: number) {
    super(`${n} is too big`)
    this.name = 'NumberIsTooBigError'
    Error.captureStackTrace(this, NumberIsTooBigError)
  }
}

export const add = async ({ x, y }: Data): Promise<number> => {
  return x + y // if we specified ResultPath, then the result will be saved into ResultPath
};

export const double = async (n: number): Promise<number> => {
  if (n > 50) throw new NumberIsTooBigError(n)
  return n * 2
};

```

And setup retry logic in serverless.yml

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

stepFunctions:
  stateMachines:
    mathStateMachine:
      name: mathStateMachine
      definition:
        Comment: my math state machine
        StartAt: Add
        States:
          Add:
            Type: Task
            Resource:
              Fn::GetAtt: [add, Arn]
            ResultPath: $.n
            Next: Double
          Double:
            Type: Task
            Resource:
              Fn::GetAtt: [double, Arn]
            InputPath: $.n
            End: true
            Retry:
              - ErrorEquals: [States.ALL] 
                MaxAttempts: 3

```
And you will see there are 4 failed executions. 1 for initial execution + 3 retries

![retries](./docs/img/007.png)

We can have different settings for different types of errors. For example the retrier for `NumberIsTooBigError`, we set 0 retry.

```yml
            Retry:
              - ErrorEquals: [NumberIsTooBigError] 
                MaxAttempts: 0
              - ErrorEquals: [States.ALL] 
                MaxAttempts: 3
```

execute
```
 sls invoke stepf --name mathStateMachine --data '{"x":42, "y":13}'
```

this time we see there is no retry

![retries](./docs/img/008.png)