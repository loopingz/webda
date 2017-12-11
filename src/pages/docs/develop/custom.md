---
title: "Custom"
description: "A Store service is a special service that handles storage for JSON objects"
layout: "guide"
icon: "code-file"
weight: 2
class: green
---

###### {$page.description}

<article id="1">

## Overview

If you need to implement a new functionality like Google Drive. You will create a service to be able to login and retrieve documents from Google Drive

It can either be an internal service that has no API exposed or an external one ( from Executor )

</article>

<article id="2">

## Internal service

If you need to implement a new functionality like Google Drive. You will create a service to be able to login and retrieve documents from Google Drive

It can either be an internal service that has no API exposed or an external one ( from Executor )


```javascript
const Service = require('webda/services/service')

class MyInternalService extends Service {

   init() {
     this._gdrive = new ...;
   }
   
   getDocument(uuid, token) {
     return this._gdrive.getDocument(uuid, token);
   }
   
}
```

The GDrive API is faked here, but basically this service will allow you to get some configuration from the webda.config.json and expose some methods for others Services or Models to use inside Webda

</article>

<article id="3">

## Service with exposed API

```javascript
const Executor = require('webda/services/executor')

class MyService extends Executor {

   init(config) {
     // Let's add our routes here, for Modda the URL should be dynamic
     config['/myservice'] = {
                              method:["GET", "DELETE"],
                              _method: this.handleRequest,
                              executor: this
                            };
     // This will declare two routes
     // GET /myservice
     // DELETE /myservice
   }
   
   delete(ctx) {
     // If we dont output anything, then the default result will be a 204
   }    
   
   get(ctx) {
    // Should output : I am a getter and i've sent an welcome email to you
    // The _params object is passed from the configuration file
    // You will see below the configuration file with the sentence attribute defined
    ctx.write(this._params.sentence);
    let otherService = this.getService("Mailer");
    otherService.send();
   }
   
   handleRequest(ctx) {
     // As we redirect both GET and DELETE to handleRequest, we filter here
     if (ctx._route._http.method === "GET") {
        this.get(ctx);
     } else {
        this.delete(ctx);
     }
   }
}
```



</article>
