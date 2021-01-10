# Playwright on AWS Lambda

This is an example project for running Playwright on AWS Lambda using the newly released features of running custom container images as Lambda functions.

**NOTE! Currently only Chromium and WebKit browser are working. Firefox requires some more tuning...**

# How to use this

## Requirements

- [Docker](https://www.docker.com/)
- [AWS Command line interface](https://aws.amazon.com/cli/) installed and [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) (if deploying to AWS)

## Locally with Docker

Build docker container image
```
docker build -t playwright-aws-lambda-example:latest .
```

Run container
```
docker run -p 9000:8080 playwright-aws-lambda-example:latest
```

Invoke function
```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

## Deploying to AWS Lambda

In the following examples, replace `YOUR_AWS_ACCOUNT_ID` with your AWS Account Id.

Create repository on AWS ECR (Elastic Container Registry)
```
aws ecr create-repository --repository-name playwright-aws-lambda-example --image-scanning-configuration scanOnPush=true
```

Tag docker image for ECR repository
```
docker tag playwright-aws-lambda-example:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/playwright-aws-lambda-example:latest
```

Login
```
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com
```

Push image to ECR
```
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/playwright-aws-lambda-example
```

Create and deploy an AWS Lambda function with your newly created container image! :rocket: