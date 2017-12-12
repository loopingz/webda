---
title: "Webda - Welcome to Serverless Application"
description: "The goal of Webda is to have a framework that allows you to code locally and test it using a Node.JS and then deploy it automatically either to Lambda with API Gateway or by creating a Docker image with it including a NodeJS server."
date: "August 02, 2016"
author: "Rémi Cattiau"
layout: "blog"
---

<article>


With the revolution of cloud we got very used to IaaS. Whenever we want a server, we just call an API and here we are with a brand new server ready within *minutes*!

But *minutes* were way too long for us! So, then came <a href="https://www.docker.com" target="_blank">Docker</a>, which made it possible to have all our environments loaded within *seconds*.

Of course, for all this you still needed a server to run on. Two years ago, AWS came up with <a href="https://aws.amazon.com/lambda/" target="_blank">Lambda</a>, where all we have to do is store the function and trigger it either by other AWS services events or by an HTTP request.

Now, let’s take the example of running lots of small services, which are called only a few thousand times per month, but as we cannot predict the time when they'll be used, they are just sitting there the rest of the time. Without Lambda, we will need more than one Docker container to run these services with failover. So the idea of having the failover and scaling without having to take care of any containers or servers was a no-brainer for me.

## Lambda

When you use Lambda and want to expose through HTTP, you discover that you can use the API Gateway of AWS. It is a nice technology but kind of complex to configure. When something goes wrong in your code, you cannot debug it as easily as when it was hosted on your machine.

So, this is where the idea of **Webda** comes in!

## The Goal

The goal of Webda is to **have a framework that allows you to code locally and test it using a Node.JS and then deploy it automatically either to Lambda with API Gateway or by creating a Docker image with it including a NodeJS server**.

This way **you can easily debug locally and then deploy to your AWS environment in a second**.

Let’s take a look at how to get started and create a new project : checkout our [Quickstart Guide](/docs/create/)

## Resources

Here are some more resources to help you: 

**Website:** <a href="http://webda.io" target="_blank">webda.io</a><br/>
**Channel:** <a href="https://www.youtube.com/playlist?list=PLfn1MAL4_e7ERdqj9rWlmEkK5gMkL4bKI" target="_blank">Youtube</a>


</article>
