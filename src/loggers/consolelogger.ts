import { Logger } from "../index";

class ConsoleLogger extends Logger {
  protected _count: number = 0;

  normalizeParams() {
    super.normalizeParams();
    if (this._levels.indexOf("CONSOLE") < 0) {
      this._levels.unshift("CONSOLE");
      this._level++;
    }
  }

  _log(level, ...args: any[]): void {
    this._count++;
    let allArgs = [...args];

    // CONSOLE level won't prefix the level
    if (level !== "CONSOLE") {
      allArgs.unshift("[" + level + "]");
    }

    // WEBDA_LOG_PREFIX will add a custom prefix (set in environment variable)
    if (process.env.WEBDA_LOG_PREFIX) {
      allArgs.unshift("[" + process.env.WEBDA_LOG_PREFIX + "]");
    }

    console.log(...allArgs);
  }

  getCount() {
    return this._count;
  }

  static getModda() {
    return {
      uuid: "Webda/ConsoleLogger",
      label: "ConsoleLogger",
      description: "Output all everything to the console",
      webcomponents: [],
      logo: "images/icons/none.png",
      configuration: {
        schema: {
          type: "object",
          properties: {
            logLevel: {
              type: "string",
              value: "INFO"
            },
            logLevels: {
              type: "string",
              value: "ERROR,WARN,CONSOLE,INFO,DEBUG"
            }
          }
        }
      }
    };
  }
}

export { ConsoleLogger };
