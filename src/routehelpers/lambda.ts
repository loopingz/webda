import { Executor, LambdaCaller, Context } from "../index";

/**
 * Execute a Lambda function and return the result, it is usefull for remote moddas already exposed
 *
 * Configuration
 * '/url': {
 *    'type': 'lambda',
 *    'arn': 'arn::....'	
 * }
 *
 */
class LambdaRouteHelper extends Executor {
  /** @ignore */
  constructor(webda, name, params) {
    super(webda, name, params);
    if (params.accessKeyId === undefined || params.accessKeyId === '') {
      this._params.accessKeyId = params.accessKeyId = process.env["WEBDA_AWS_KEY"];
    }
    if (params.secretAccessKey === undefined || params.secretAccessKey === '') {
      this._params.secretAccessKey = params.secretAccessKey = process.env["WEBDA_AWS_SECRET"];
    }
  };

  /**
   * Handle the result from the Lambda function
   * Should be the form known by Webda
   *
   * @ignore
   */
  handleResult(ctx, data) {
    try {
      // Should parse JSON
      var result = JSON.parse(data);
      if (result.code == undefined) {
        result.code = 200;
      }
      if (result.headers == undefined) {
        result.headers = {}
      }
      if (result.headers['Content-Type'] == undefined) {
        result.headers['Content-Type'] = 'application/json';
      }
    } catch (err) {
      console.log("Error '" + err + "' parsing result: " + data);
      throw 500;
    }
    ctx.writeHead(result.code, result.headers);
    if (result.body != undefined) {
      ctx.write(result.body);
    }
    ctx.end();
  }

  async execute(ctx : Context) : Promise<any> {
    var caller;
    try {
      caller = new LambdaCaller(ctx._params);
    } catch (e) {
      ctx.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      ctx.end();
      throw e;
    }
    let data = await caller.execute({
      '_http': ctx._route._http
    });
    await this.handleResult(ctx, data.Payload);
  }
}

export { LambdaRouteHelper };
