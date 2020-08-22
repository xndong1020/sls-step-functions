#### 37. Best practices

1. Set timeout

- Set timeout for the wholo execution

![whole execution](./docs/img/021.png)

- Set timeout for task state

![whole execution](./docs/img/022.png)


2. Store data in S3/DynamoDB instead of passing large payloads between states, payloads has a limit of 32KB

3. Handle service exceptions

4. Step alerts on Step Function executions, at minumum should have alarm for `ExecutionFailed`, `ExecutionTimedOut`, `ExecutionAborted`, `ExecutionThrottled` 