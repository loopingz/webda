---
title: "AWS"
description: "Deploy on Lambda and API Gateway for true serveless experience."
layout: "guide"
weight: 1
index: ""
---

<article id="1">

## Overview

![image](http://webda.io/images/schemas/aws_deploy.png)

</article>

<article id="2">

## Deployment Policy

To be able to deploy the deployment user must have at least :

```javascript
{
	"Sid": "Stmt1438583420001",
	"Effect": "Allow",
	"Action": [
		"lambda:*",
		"iam:PassRole",
		"apigateway:*"
	],
	"Resource": [
		"*"
	]
}
```
This can be restrict more and should, need to update the documentation

</article>

<article id="3">

## Package

The package is a zip of your folder, we dont have advanced cleaning feature nor ignore files, so the package can be big if you forget to clean your folder before.

</article>

<article id="4">

## Lambda

Once the package done, it will be upload as a Lambda function with the name specified, updating if it already exists.

</article>

<article id="5">

## API Gateway

It map all the routes from your application, if a **website** parameter is found on the parameters of deployment then it will enable CORS for you for this URL

It also deploy the API as Stage named with the name of the deployment.

</article>
