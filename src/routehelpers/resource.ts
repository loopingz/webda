import {
  Executor,
  Context
} from "../index";
const mime = require("mime");
const fs = require('fs');

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
  execute(ctx: Context): Promise < any > {
    return new Promise((resolve, reject) => {
      fs.readFile(this._params.file, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        ctx.writeHead(200, {
          'Content-Type': mime.getType(this._params.file) || 'application/octet-stream'
        });
        ctx.write(data);
        ctx.end();
        return resolve();
      });
    });
  }
}

export {
  ResourceRouteHelper
};
