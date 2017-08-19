"use strict";
const QueueService = require("./queueservice");
const AWS = require('aws-sdk');

class SQSQueueService extends QueueService {

  init(config) {
    super.init(config);
    if (this._params.accessKeyId === undefined || this._params.accessKeyId === '') {
      this._params.accessKeyId = process.env["WEBDA_AWS_KEY"];
    }
    if (this._params.secretAccessKey === undefined || this._params.secretAccessKey === '') {
      this._params.secretAccessKey = process.env["WEBDA_AWS_SECRET"];
    }
    if (this._params.accessKeyId && this._params.secretAccessKey) {
      AWS.config.update({accessKeyId: this._params.accessKeyId, secretAccessKey: this._params.secretAccessKey});
    }
    if (this._params.region !== undefined) {
      AWS.config.update({region: this._params.region});
    } else if (process.env["AWS_DEFAULT_REGION"]) {
      AWS.config.update({region: process.env["AWS_DEFAULT_REGION"]});
    }
    this.sqs = new AWS.SQS();
    if (!this._params.WaitTimeSeconds) {
      this._params.WaitTimeSeconds = 20;
    }
  }

  size() {
    return this.sqs.getQueueAttributes({
      AttributeNames: ["ApproximateNumberOfMessages", "ApproximateNumberOfMessagesNotVisible"],
      QueueUrl: this._params.queue
    }).promise().then((res) => {
      return Promise.resolve(parseInt(res['Attributes']['ApproximateNumberOfMessages']) + parseInt(res['Attributes']['ApproximateNumberOfMessagesNotVisible']));
    });
  }

  sendMessage(params) {
    var sqsParams = {};
    sqsParams.QueueUrl = this._params.queue;
    sqsParams.MessageBody = JSON.stringify(params);
    return this.sqs.sendMessage(sqsParams).promise();
  }

  receiveMessage() {
    this.queueArg = {QueueUrl: this._params.queue, WaitTimeSeconds: this._params.WaitTimeSeconds};
    return new Promise((resolve, reject) => {
      this.sqs.receiveMessage(this.queueArg).promise().then((data) => {
        if (!data.Messages) {
          return resolve([]);
        }
        return resolve(data.Messages);
      });
    });
  }

  deleteMessage(receipt) {
    return new Promise((resolve, reject) => {
      this.sqs.deleteMessage({QueueUrl: this._params.queue, ReceiptHandle: receipt}, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  __clean() {
    return this.sqs.purgeQueue({QueueUrl: this._params.queue}).promise();
  }

  install(params) {
    let queue = this._getQueueInfosFromUrl();
     var sqs = new params.AWS.SQS();
     return sqs.getQueueUrl({QueueName: queue.name, QueueOwnerAWSAccountId: queue.accountId}).promise().catch( (err) => {
      if (err.code === 'AWS.SimpleQueueService.NonExistentQueue') {
        console.log('\tCreating SQS queue ', queue.name);
        return sqs.createQueue({QueueName: queue.name}).promise();
      }
     });
  }

  _getQueueInfosFromUrl() {
    let re = new RegExp(/.*sqs\.(.*)\.amazonaws.com\/([0-9]+)\/(.*)/, 'i');
    let found = re.exec(this._params.queue);
    if (found.length != 4) {
      throw new Error('SQS Queue URL malformed');
    }
    return {
      accountId: found[2],
      region: found[1],
      name: found[3]
    };
  }

  getARNPolicy() {
    // Parse this._params.queue;
    let queue = this._getQueueInfosFromUrl();
    return {
        "Sid": this.constructor.name + this._name,
        "Effect": "Allow",
        "Action": [
            "sqs:DeleteMessage",
            "sqs:DeleteMessageBatch",
            "sqs:ReceiveMessage",
            "sqs:SendMessage",
            "sqs:SendMessageBatch"
        ],
        "Resource": [
            'arn:aws:sqs:' + queue.region + ':' + queue.accountId + ':' + queue.name
        ]
    }
  }

  static getModda() {
    return {
      "uuid": "Webda/SQSQueue",
      "label": "SQS Queue",
      "description": "Implements a Queue stored in SQS",
      "webcomponents": [],
      "documentation": "https://raw.githubusercontent.com/loopingz/webda/master/readmes/Binary.md",
      "logo": "images/placeholders/sqs.png",
      "configuration": {
        "default": {
          "queue": "YOUR QUEUE URL"
        },
        "schema": {
          type: "object",
          properties: {
            "accessKeyId": {
              type: "string"
            },
            "secretAccessKey": {
              type: "string"
            },
            "queue": {
              type: "string"
            }
          },
          required: ["accessKeyId", "secretAccessKey", "queue"]
        }
      }
    }
  }

}

module.exports = SQSQueueService;