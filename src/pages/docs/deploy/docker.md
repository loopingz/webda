---
title: "Docker"
description: "The easier way to ship software."
layout: "guide"
weight: 1
---

###### {$page.description}

<article id="1">

You can use webda to build your Docker image for you

## Dockerfile

You can create your own Dockerfile, if no Dockerfile is present then the default one is used

```
FROM node:latest
MAINTAINER docker@webda.io

RUN mkdir /server/
ADD . /server/

RUN cd /server && rm -rf node_modules && npm install
CMD cd /server && node_modules/.bin/webda serve > /data/webda.log
```

</article>

<article id="2">

## Configuration

The configuration take only two parameters the tag of the image to create and if it needs to push the image after a succesfull build.


```javascript
{
   tag: "mytag",
   push: true
}

```

</article>
