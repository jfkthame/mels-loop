import { Logger, ISettings } from "tslog";
import chalk from "chalk";

type LogColors =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"
	| "blackBright"
	| "redBright"
	| "greenBright"
	| "yellowBright"
	| "blueBright"
	| "magentaBright"
	| "cyanBright"
	| "whiteBright";

export enum LogType {
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
}

interface ILoggerConf {
	options?: Partial<ISettings>;
	disabled?: boolean;
	disableLevel?: LogType[];
}

export class Log {
	private log: Logger;
	private disabled: boolean;
	private disableLevel: LogType[];

	constructor({ options, disabled, disableLevel }: ILoggerConf) {
		this.disabled = disabled;
		this.disableLevel = disableLevel;

		const defaults = {
			displayLogLevel: false,
			displayDateTime: false,
			displayRequestId: false,
			displayInstanceName: false,
			displayFunctionName: false,
			displayFilePath: "hidden",
		} as ISettings;

		if (this.disabled) {
			return;
		}

		this.log = new Logger(Object.assign({}, defaults, options));
	}

	private isDisabled(type?: LogType) {
		return this.disabled || this.disableLevel.includes(type);
	}

	private getTopic(color: LogColors, topic: string) {
		if (this.isDisabled()) {
			return;
		}
		return topic ? chalk[color ? color : "blue"](topic) : "";
	}

	private getTemplate(topic: string, msg: string, color: LogColors) {
		if (this.isDisabled()) {
			return;
		}
		return `${this.getTopic(color, topic)} - ${msg}`;
	}

	public info(topic: string, msg: string, color?: LogColors) {
		if (this.isDisabled(LogType.INFO)) {
			return;
		}
		this.log.info(this.getTemplate(topic, msg, color));
	}

	public warn(topic: string, msg: string, color?: LogColors) {
		if (this.isDisabled(LogType.WARN)) {
			return;
		}
		this.log.warn(this.getTemplate(topic, msg, color || "redBright"));
	}

	public error(msg: string, error?: unknown) {
		if (this.isDisabled(LogType.ERROR)) {
			return;
		}
		this.log.error(this.getTemplate("", `${msg} - ${String(error)}`, "red"));
	}
}

// instanceName: "InstanceName",
// printLogMessageInNewLine: true,
// dateTimePattern: "hour:minute:second",
// displayTypes: true,
// colorizePrettyLogs: true,
// exposeErrorCodeFrame: true,
// exposeStack: true,
// setCallerAsLoggerName: true,
