import { Webda, _extend } from './core';
import { Service } from './services/service';
import { Executor } from './services/executor';
import { AWSMixIn } from './services/aws-mixin';
// Policies
import { OwnerPolicy } from './policies/ownerpolicy';
// Models
import { CoreModel } from './models/coremodel';
import { Ident } from './models/ident';
import { User } from './models/user';
// Utils
import { Context } from './utils/context';
import { SecureCookie } from './utils/cookie';
import { LambdaCaller } from './utils/lambdacaller';
// Handler
import { LambdaHandler } from './handlers/lambda';
// Store
import { Store } from './stores/store';

import { DynamoStore } from './stores/dynamodb';
import { FileStore } from './stores/file';
import { MemoryStore } from './stores/memory';
import { MongoStore } from './stores/mongodb';

// Services
import { Mailer } from './services/mailer';
import { Authentication } from './services/authentication';

// Queues
import { Queue } from './queues/queueservice';
import { SQSQueue } from './queues/sqsqueue';
import { MemoryQueue } from './queues/memoryqueue';


const AsyncEvents = require('./services/asyncevents');
const Binary = require('./services/binary');
const FileBinary = require('./services/filebinary');
const S3Binary = require('./services/s3binary');

export {
  Webda as Core,
  _extend,
  // Services
  Service,
  Executor,
  OwnerPolicy,
  AsyncEvents,
  AWSMixIn,
  Binary,
  FileBinary,
  Mailer,
  Authentication,
  S3Binary,
  // Store
  Store,
  DynamoStore,
  FileStore,
  MemoryStore,
  MongoStore,
  // Queues
  Queue,
  SQSQueue,
  MemoryQueue,
  // Models
  CoreModel,
  Ident,
  User,
  // Utils
  SecureCookie,
  LambdaCaller,
  Context,
  // Handler
  LambdaHandler
}