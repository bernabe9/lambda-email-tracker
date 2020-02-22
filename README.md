# Lambda Email Tracker
Lambda function to track opened emails

## Setup
1. Create a `config.yml` file in the root folder
2. Copy & paste the content from `config.example.yml` to `config.yml`
3. Replace the values with your data

## Deploy
1. Setup credentials for AWS lambda: https://serverless.com/framework/docs/providers/aws/guide/credentials/
2. Run `serverless deploy`
3. Configure API Gateway to support binary media types
4. Set up an image URL proxy whitelist: https://support.google.com/a/answer/3299041?hl=en

## Usage
Add an image in your email with the lambda's URL.

For example, https://my-lambda.us-east-1.amazonaws.com/dev/image.png?to=receiver_email@gmail.com

Note: The image will be invisible
