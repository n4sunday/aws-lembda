[![](https://pbs.twimg.com/profile_images/1217566226827759616/hM6lnfw8_400x400.jpg)](https://aws.amazon.com/)

# AWS Lambda Functions

Now that you have Node.js runtime, proceed to install the Serverless framework

```
npm install -g serverless
```

Check that the Serverless framework was installed.

```
serverless --version
```

Configure serverless CLI with your AWS credentials. This is necessary for deployment.

```
serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>
```

How to deploy the app

```
serverless deploy
```
