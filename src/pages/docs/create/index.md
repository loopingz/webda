---
title: "Quick start"
description: "How to startup a project."
layout: "guide"
icon: "flash"
weight: 1
class: blue
index: "index.html"
---

###### {$page.description}

<article id="1">

## Installation

You first need to install webda-shell.

```shell
npm install -g webda-shell
```

This will install the webda shell tools, that allows you to configure and deploy your project
You have the configuration UI available, where you can create a service, use a service, or create a custom API resource. You can also manually edit the webda.config.json if you prefer

Below is the manual step with the manual modification, I would recommand to use the configuration UI to modify the webda.config.json

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

This is defining the GET /myurl API

There is 5 types of route : file, inline, lambda, resource, string

### File route

**file** include the javascript file and call its main export with the context

webda.config.json
```javascript
{
  "*": "demo.webda.io",
  "demo.webda.io": {
  	...
  	"/myapi": {
  	  "type": "file",
  	  "file": "./test.js"
  	}
  }
}
```
test.js
```javascript
module.exports = (ctx) {
  ctx.write('This is my custom API')
}
```

### Inline route

**inline** eval the content of the callback string

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

### Lambda route

**lambda** call a Lambda function and return its result

### Resource route

**resource** return the content of the file, guessing it's mime type

```javascript
{
  "*": "demo.webda.io",
  "demo.webda.io": {
  	...
  	"/myurl": {
  	  "type": "resource",
  	  "file": "./test.jpg"
  	}
  }
}
```

This will return the jpeg with image/jpeg mime type

### String route

**string** return the content of result, you can specify the mime

```javascript
{
  "*": "demo.webda.io",
  "demo.webda.io": {
  	...
  	"/myurl": {
  	  "type": "string",
  	  "result": "Hi Webda !"
  	}
  }
}
```

This will return a "Hi Webda !"

</article>

<article id="4">

## Create a new service

We will create a new service from executor, so we can map some urls directly to the service

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

Here is the corresponding configuration


```javascript
{
  ...
  services: {
     ...
     "MyService": {
       require: "./myservice.js",
       sentence: "I am a GET route and i've sent an welcome email to you"
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

"I am a GET route and i've sent an welcome email to you"

And then the http://localhost:18080/myurl

"I am a inline route"

</article>