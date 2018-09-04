---
title: "Develop"
description: "Webda provides you several services or you can create your own service"
layout: "guide"
icon: "code-file"
weight: 2
class: green
url: /docs/develop/index.html
---

###### {$page.description}

<article id="1">

## Concepts

Webda introduces some basic concepts :

 * *Service* a singleton similar to Spring Bean to implement behaviors
 * *Executor* is a service that provide some routes and expose API to the world
 * *Model* to define your business logic 
 * *Deployment* an instance of the app with its own configuration

The **webda.config.json** contains the configuration of the app, defining Services, Routes and global configuration, you can consider it as the applicationContext.xml of Spring if you prefer, with Beans=Services

</article>

<article id="2">

## Stores

The store services allow you to store object in a NoSQL database it handles for you mapping between objects, have a security policy and check the object with JSON Schema

We have currently File, DynamoDB and MongoDB storage

[Learn More](/docs/develop/store)

</article>

<article id="3">

## Binaries

The storage of files is handle by those categories, we have two services FileStorage and S3Storage

The storage detect duplicates and don't double store them, it also provides a Polymer component that will prevent upload of known binaries by using a challenge to speed up the upload.

[Learn More](/docs/develop/binary)

</article>

<article id="4">

## Models

The stores use Models to load/save/validate/secure business object.

The models should implement most of your business logic, while service should be technical implementation

[Learn More](/docs/develop/models)

</article>