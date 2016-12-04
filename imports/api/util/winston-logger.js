"use strict";
import { Meteor } from 'meteor/meteor';

// prepare
let logger;
const env = process.env.NODE_ENV;

if (Meteor.isServer) {

	// Import npm packages
	let winston = Npm.require('winston');
	let fs = Npm.require('fs');
	let colors = Npm.require('colors');

	const debugLogDir = '../../../../logs-debug';
	const logDir = 'logs';	// use this logDir to have new log every time server is build (development)

	// Create the app log directory if it does not exist
	if (!fs.existsSync(logDir)) {
		console.log('Directory \"logs\" for app.log is missing. Creating logDir');
		fs.mkdirSync(logDir);
	}

	if (env === 'development') {
		// Create the debug log directory if it does not exist
		if (!fs.existsSync(debugLogDir)) {
			console.log('Directory \"logs-debug\" for debug.log is missing. Creating debugLogDir');
			fs.mkdirSync(debugLogDir);
		}
	}

	let customLeves = {
		levels: {
			error: 0,
			debug: 1,
			warn: 2,
			info: 3,
			dev: 4
		},
		colors: {
			error: 'red',
			debug: 'blue',
			warn: 'yellow',
			info: 'green',
			dev: 'cyan'
		}
	};

	// (winston.config.syslog.levels):	emerg=0, alert=1, crit=2, error=3, warning=4, notice=5, info=6, debug=7

	// Setup custom logger

	logger = new (winston.Logger)({
		levels: (customLeves.levels),
		colors: (customLeves.colors),
	});

	const fileLogFormat = function (options) {
		// let space = '\t\t\t\t\t\t\t\t\t\t\t';	// 11 tabs
		return options.timestamp() + ' '
			+ '[' + options.level.toUpperCase() + '] '
			+ (undefined !== options.message ? options.message : '')
			+ (options.meta && Object.keys(options.meta).length ? '\n' + JSON.stringify(options.meta, null, '\t') : '' );
	};

	// Prepare custom transports
	const appLoggerOptions = {
		name: 'app-logger',
		level: 'info',
		json: false,
		timestamp: function () {
			return (new Date).toString();
		},
		formatter: function (options) {
			// Return string will be passed to logger.
			return fileLogFormat(options);
		},
		filename: `${logDir}/app.log`,
	};

	const debugLoggerOptions = {
		name: 'debug-logger',
		level: 'debug',
		json: false,
		timestamp: function () {
			return (new Date).toString();
		},
		formatter: function (options) {
			// Return string will be passed to logger.
			return fileLogFormat(options);
		},
		filename: `${debugLogDir}/debug.log`,
	};

	// Console log
	// const consoleLogFormat = function (options) {
	// 	// let space = '\t\t\t\t\t\t\t\t\t\t\t';	// 11 tabs
	// 	return config.colorize(options.level) + ': '
	// 		+ (undefined !== options.message ? options.message : '')
	// 		+ (options.meta && Object.keys(options.meta).length ? '\n' + JSON.stringify(options.meta, null, '\t') : '' );
	// };

	const constoleLoggerOptions = {
		level: env === 'development' ? 'dev' : 'info',
		colorize: true,
		json: false,
		prettyPrint: true,
		// handleExceptions: true,
		// formatter: function (options) {
		// 	// Return string will be passed to logger.
		// 	return consoleLogFormat(options);
		// }
	};

	// add transports
	logger.add(winston.transports.Console, constoleLoggerOptions);
	logger.add(winston.transports.File, appLoggerOptions);

	if (env === 'development') {
		logger.add(winston.transports.File, debugLoggerOptions);
	}

	// add test logs function
	logger.testLogger = function () {
		logger.dev('dev message');
		logger.info('info message');
		logger.warn('warn message');
		logger.debug('debug message');
		logger.error('error message');
	}
}

// Export Logger
export const Logger = logger;
