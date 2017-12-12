---
title: "Configuration Resolution"
description: "How Webda resolve service parameters."
layout: "guide"
weight: 2
---

###### {$page.description}

<article id="1">

## Overview

To ease up the configuration of an application we came up with the follow configuration resolution schema.

You have the global configuration for the application, that is override by the deployment configuration, that is override by the local element configuration, and finally override by the deployment element configuration.

![image](/images/configuration_resolution.png)

The webda.config.json params attribute is the general configuration

```javascript
{
  "param1": "test1",
  "param2": "test2",
  "param3": {
    "subparam1": "subtest1"
  }
}
```
A deployment can override the general configuration with its params attribute
So with a deployment global configuration like

```javascript
{
  "param1": "deploytest1",
  "param2": "deplyparamtest2"
}
```

The service definition can include local configuration
```javascript
{
  "param2": "localtest2",
  "param3": {
    "subparam2": "sublocaltest2"
  }
}
```

Finally the deployment can override service configuration
```javascript
{
  "param3": {
    "subparam2": "subdeploytest2"
  }
}
```

So this how webda will resolve Service final configuration

```javascript
// Step 1 - Global configuration
{
  "param1": "test1",
  "param2": "test2",
  "param3": {
    "subparam1": "subtest1"
  }
}
// Step 2 - Deployment global configuration override
{
  "param1": "deploytest1",
  "param2": "deplyparamtest2",
  "param3": {
    "subparam1": "subtest1"
  }
}
// Step 3 - Service local configuration override
{
  "param1": "deploytest1",
  "param2": "localtest2",
  "param3": {
    "subparam1": "subtest1",
    "subparam2": "sublocaltest2"
  }
}
// Step 4 - Service deployment configuration override
{
  "param1": "deploytest1",
  "param2": "localtest2",
  "param3": {
    "subparam1": "subtest1",
    "subparam2": "subdeploytest2"
  }
}
```




</article>

<article id="2">

## Configuration UI

Here is some screenshots of the ui

#### Routes

![image](/images/ui_route_create.png) ![image](/images/ui_route_config.png) 

#### Services

![image](/images/ui_service_create.png) ![image](/images/ui_service_config.png)

#### Deployments

![image](/images/ui_deployment_create.png) ![image](/images/ui_deployment_config.png) ![image](/images/ui_deployment_deploy.png)

</article>
