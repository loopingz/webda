---
title: "Create"
description: "How to startup a project."
layout: "guide"
icon: "flash"
weight: 1
class: blue
---

###### {$page.description}

<article id="1">

## Installation

You first need to install webda-shell.

```shell
npm install -g webda-shell
```

This will install the webda shell tools, that allows you to configure and deploy your project

</article>

<article id="2">

## Init a project

Create a new project folder

```shell
mkdir my-new-project
cd my-new-project
```

If you do want to use our sample project, first type

```shell
webda init
```

Launch your project configuration interface

```shell
webda config
```

You should now see the configuration website in your browser

</article>

<article id="3">

## Create a new route

We will use the inline RouteHelper here, except the Lambda Route helper, the other are mainly helper for quick and easy test but you should use Service when you can as they are easier to unit test and make code cleaner.

```javascript
{
  "*": "demo.webda.io",
  "demo.webda.io": {
  	...
  	"/myurl": {
  	  "type": "inline",
  	  "callback": "function(ctx) { ctx.write('I am an inline route'); }"
  	}
  }
}
```

</article>

<article id="4">

## Create a new service

We will create a new executor, so we can map some urls directly to the service

```javascript
const Executor = require('webda/services/executor')

class MyService extends Executor {

   init(config) {
   	 // Let's add our routes here, for Modda the URL should be dynamic
   	 config['/myservice']={method:["GET", "DELETE"], _method: this.handleRequest, executor: this};
   }
   
   delete(ctx) {
     // If we dont output anything, then the default result will be a 204
   }	
   
   get(ctx) {
    // Should output : I am a getter and i've sent an welcome email to you
	ctx.write(this._params.sentence);
   	let otherService = this.getService("Mailer");
   	otherService.send();
   }
   
   handleRequest(ctx) {
     if (ctx._route._http.method === "GET") {
     	this.get(ctx);
     } else {
        this.delete(ctx);
     }
   }
)
```

Here is the corresponding configuration


```javascript
{
  ...
  services: {
     ...
     "MyService": {
       require: "./myservice.js",
       sentence: "I am a getter and i've sent an welcome email to you"
     }
     ...
  }
  ...
}

```

</article>

<article id="5">

## Run it

```
webda serve
```

You can call the http://localhost:18080/myservice, and see the nice output

"I am a getter and i've sent an welcome email to you"

And then the http://localhost:18080/myurl

"I am a inline route"

</article>