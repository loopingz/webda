---
title: "Queues"
description: "A simple QueueService that allow PUT and GET on a Queue"
layout: "guide"
icon: "code-file"
weight: 2
class: green
index: ""
---

###### {$page.description}


<article id="1">

## Overview

This is a wrapper on AWS SQS, it also have a MemoryQueue for unit test.

You can define a worker that is the method that will be called on each item of the queue, if the method fails the underlying implementation will retry it later.

</article>

<article id="2">

## Worker

*to be completed*

</article>
