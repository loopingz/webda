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

![image]({$site.basePath ?: ''}/images/configuration_resolution.png)

This is the detail configuration for each section

```general
// Global Configuration
{
  "param1": "test1",
  "param2": "test2",
  "param3": {
    "subparam1": "subtest1"
  }
}
```
```deployment-general
// Deployment Global Configuration
{
  "param1": "deploytest1",
  "param2": "deplyparamtest2"
}

```
```service
// Service Local Configuration
{
  "param2": "localtest2",
  "param3": {
    "subparam2": "sublocaltest2"
  }
}
```
```deployment-service
// Service Deployment Configuration
{
  "param3": {
    "subparam2": "subdeploytest2"
  }
}
```
```result
// Service Deployment Configuration
{
  "param1": "deploytest1",
  "param2": "localtest2",
  "param3": {
    "subparam1": "subtest1",
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

![image]({$site.basePath ?: ''}/images/ui_route_create.png) ![image]({$site.basePath ?: ''}/images/ui_route_config.png) 

#### Services

![image]({$site.basePath ?: ''}/images/ui_service_create.png) ![image]({$site.basePath ?: ''}/images/ui_service_config.png)

#### Deployments

![image]({$site.basePath ?: ''}/images/ui_deployment_create.png) ![image]({$site.basePath ?: ''}/images/ui_deployment_config.png) ![image]({$site.basePath?: ''}/images/ui_deployment_deploy.png)

</article>
