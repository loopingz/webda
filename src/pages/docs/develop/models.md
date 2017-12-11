---
title: "Models"
description: "Implement your business logic directly in your Model"
layout: "guide"
icon: "code-file"
weight: 2
class: green
---

###### {$page.description}

<article id="1">

## Overview

Model is the best way to express your business logic.

Stores will use them to load/save/validate your objects and access to it. If no model are specified to a Store it will use the default CoreModel

</article>

<article id="2">

## Security

The model has a predefined method *canAct* that will be called whenever an action is trigger on an object from an external source

This method return a Promise that will stop the processing if it is rejected

```javascript
class CoreModel {
  canAct(ctx, action) {
    if (action === 'create') {
      return this.canCreate(ctx);
    } else if (action === 'update') {
      return this.canUpdate(ctx);
    } else if (action === 'get') {
      return this.canGet(ctx);
    } else if (action === 'delete') {
      return this.canDelete(ctx);
    }
  }
}
```

</article>

<article id="3">

## Custom Actions

The model can defined action that will be exposed by its Store

```javascript
class CoreModel {
    static getActions() {
      return {
        'push': {method: 'POST'},
        'qrcode': {method: ['GET', 'PUT']}
      };
    }
}
```

</article>