#### 25. What are activities?

In previous examples, step functions is responsible for controlling all states in the state machine. 

Activities allows state machine to pause, and wait for **external activities** to complete, either success/fail, then the state machine can transit into other states.

Maybe to avoid using activities? 

https://blog.rowanudell.com/best-practices-for-aws-step-functions/

Avoid Activities
Activities used to be the only way to do long-running, out-of-band work that didn't fit in to a Step Function service integration.

This is no longer the case now that we have the callback pattern: Start a task, and have the worker callback to the Step Function (with the task token) when it's completed; no polling, no waiting.