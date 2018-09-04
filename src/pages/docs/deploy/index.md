---
title: "Deploy"
description: "Webda allow you to deploy to different environment as Docker, WeDeploy and of course Lambda."
layout: "guide"
icon: "cloud"
weight: 4
class: orange
index: "index.html"
---

###### {$page.description}

<article id="1">

## Lambda

To be able to run a 'webserver' on Lambda, you need to setup API Gateway, and configure every path defined by your code to link to your Lambda.

This is how a normal deployment looks like :
[img](Lambda Deployment)

But don't worry, with Webda it is as simple as a command

```bash
webda deploy -d LambdaDeployment
```

This command will do several step for you :

 - Create the policy and role for your Lambda
 - Create if needed the Dynamo table used in your application
 - Create S3 buckets used in your application
 - Deploy the code to your Lambda
 - Create the API Gateway mapping
 - Add permission for API Gateways to your Lambda

</article>

<article id="2">

## Docker

You can also just define a Docker image to build

It will build the image for you with the Dockerfile specified or create a dynamic Dockerfile if not specified

If you specify a tag, after the build it will push the image to your repository

</article>

<article id="3">

## WeDeploy

This service run your Docker image and allow you to deploy with a single command

As an extend to our Docker deployment, we can build the Dockerfile and deploy it directly to your WeDeploy account. Just specify the WeDeploy Project and Service, and we will take care of the rest.

</article>
