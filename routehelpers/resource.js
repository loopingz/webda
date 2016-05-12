"use strict";
const Executor = require('../services/executor.js');
const mime = require("mime");

/**
 * Output a file raw from the hard drive
 *
 * Configuration
 * '/url': {
 *    'type': 'resource',
 *    'file': 'images/test.png'	
 * }
 *
 */
class ResourceRouteHelper extends Executor {
	/** @ignore */
	execute() {
		return new Promise( (resolve, reject) => {
			fs.readFile(this._params.file, 'utf8', (err,data) => {
			  if (err) {
			    return reject(err);
			  }
			  var mime_file = mime.lookup(this._params.file);
			  console.log("Send file('" + mime_file + "'): " + this._params.file);
			  if (mime_file) {
			  	this.writeHead(200, {'Content-Type': mime_file});
			  }
			  this.write(data);
			  this.end();
			  return resolve();
			});
		});
	}
}

module.exports = ResourceRouteHelper